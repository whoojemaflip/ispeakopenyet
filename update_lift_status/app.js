const AWS = require('aws-sdk')
const axios = require('axios')
const moment = require('moment')
const keys = require('../config/keys')

AWS.config.loadFromPath('../config/keys.json')
const s3 = new AWS.S3()

const S3Params = {
  Bucket: 'ispeakopenyet'
}

function time() {
  return moment().format('H:mm')
}

function timestamp() {
  return moment().format()
}

function today() {
  return moment().format('YYYY-MM-DD')
}

function updateWeeklyLiftStatus(currentLiftStatus, lastWeekLiftStatus) {
  const lifts = currentLiftStatus['Lifts']
  var todaysLiftStatus = lastWeekLiftStatus[today()] || {}
  var changed = false

  for (const lift in lifts) {
    if (!todaysLiftStatus[lift]) {
      todaysLiftStatus[lift] = {}
    }

    if (lifts[lift] == 1 && !todaysLiftStatus[lift]['Standby']) {
      todaysLiftStatus[lift]['Standby'] = time()
      changed = true
    } else if (lifts[lift] == 2 && !todaysLiftStatus[lift]['Running']) {
      todaysLiftStatus[lift]['Running'] = time()
      changed = true
    }
  }

  return [
    {
      ...lastWeekLiftStatus,
      'lastUpdated': timestamp(),
      [today()]: todaysLiftStatus,
    }, changed]
}

function getCurrentLiftStatus(terrainStatus) {
  var date = terrainStatus['Date']
  var lifts = terrainStatus['Lifts'].reduce(function(acc, lift) {
    // let mountain = lift['Mountain']
    let liftName = lift['Name']
    let liftStatus = lift['Status']

    acc[liftName] = liftStatus
    return acc
  }, {})

  return {
    'Date': date,
    'Lifts': lifts
  }
}

function getLastWeekLiftOpeningTimesJson(callback) {
  s3Get('last_week_lift_opening_times.json', callback)
}

function updateLastWeekLiftOpeningTimesJson(json_data) {
  s3Write('last_week_lift_opening_times.json', json_data)
}

function updateTerrainStatusJson(json_data) {
  s3Write('terrain_status_feed.json', json_data)
}

function fetchTerrainStatusJson(callback) {
  const url = 'https://www.whistlerblackcomb.com/the-mountain/mountain-conditions/terrain-and-lift-status.aspx'

  axios.get(url)
    .then(response => response.data)
    .then(page_html => page_html.match(/TerrainStatusFeed[^{]*(.*);/)[1])
    .then(html => JSON.parse(html))
    .then(result => callback(result))
}

function s3Get(filename, callback) {
  s3.getObject(
    {
      ...S3Params,
      Key: filename
    },
    function(err, data) {
      if (err) console.log(err)
      else {
        console.log(data.Body.toString())
      }

      callback(JSON.parse(data.Body.toString()))
    }
  )
}

function s3Write(filename, json_data) {
  s3.putObject(
    {
      ...S3Params,
      Key: filename,
      Body: JSON.stringify(json_data),
      ContentType: 'application/json',
    },
    function(err, data) {
      if(err) console.log(err)
      else {
        console.log('Updated ' + filename)
      }
    },
  )
}

function seedLastWeekOpeningTimesJson() {
  seedJson = {
    "lastUpdated": "2020-12-02 16:22"
  }

  seedJson[today()] = {
    'Gondola': {
      'Standby': 'December 3rd 2020, 6:28:05 pm',
      'Running': 'December 3rd 2020, 6:28:05 pm'
    }
  }

  updateLastWeekLiftOpeningTimesJson(seedJson)
}

exports.lambdaHandler = async function(event, context) {
  fetchTerrainStatusJson(function(currentTerrainStatus) {
    updateTerrainStatusJson(currentTerrainStatus)

    currentLiftStatus = getCurrentLiftStatus(currentTerrainStatus)
    getLastWeekLiftOpeningTimesJson(function(lastWeekLiftStatus) {
      let [updatedLastWeekLiftStatus, changed] = updateWeeklyLiftStatus(currentLiftStatus, lastWeekLiftStatus)

      if (changed) {
        updateLastWeekLiftOpeningTimesJson(updatedLastWeekLiftStatus)
      }
    })
  })
}
