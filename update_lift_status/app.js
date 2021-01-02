const AWS = require('aws-sdk');
const axios = require('axios');
const moment = require('moment');
const s3 = new AWS.S3();

const S3Params = {
  Bucket: 'alpinelifts.ca'
};

const terrain_status_api_url = 'https://cms6ky5e1l.execute-api.us-east-1.amazonaws.com/default/lift_api';

function updateWeeklyLiftStatus(currentLiftStatus, lastWeekLiftStatus) {
  const lifts = currentLiftStatus['Lifts'];
  const today = date();
  var todaysLiftStatus = lastWeekLiftStatus[today] || {}

  for (const lift in lifts) {
    if (!todaysLiftStatus[lift]) {
      if (lifts[lift] == 1) {
        todaysLiftStatus[lift] = timestamp();
      } else {
        todaysLiftStatus[lift] = null;
      }
    }
  }

  const result = {
    ...lastWeekLiftStatus,
    'lastUpdated': timestamp(),
    [today]: todaysLiftStatus,
  };

  return result;
}

function getCurrentLiftStatus(terrainStatus) {
  var date = terrainStatus['Date'].match(/(\d+)/g)[0];

  var lifts = terrainStatus['Lifts'].reduce(function(acc, lift) {
    let liftName = lift['Name'];
    let liftStatus = lift['Status'];

    acc[liftName] = liftStatus;
    return acc;
  }, {});

  return {
    'Date': date,
    'Lifts': lifts
  };
}

function truncateToLastWeek(updatedLastWeekLiftStatus) {
  return updatedLastWeekLiftStatus;
}

 async function lambdaHandler(event, context) {
  const terrainStatus = await fetchTerrainStatusJson();
  updateTerrainStatusJson(terrainStatus)

  const currentLiftStatus = getCurrentLiftStatus(terrainStatus);
  // console.log(currentLiftStatus);

  const lastWeekLiftStatus = await getLastWeekLiftOpeningTimesJson();
  // console.log(lastWeekLiftStatus);

  const updatedWeeklyLiftStatuses = updateWeeklyLiftStatus(currentLiftStatus, lastWeekLiftStatus);
  // console.log(updatedLastWeekLiftStatus);

  const updatedLastWeekLiftStatus = truncateToLastWeek(updatedWeeklyLiftStatuses);

  updateLastWeekLiftOpeningTimesJson(updatedLastWeekLiftStatus);

  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: updatedLastWeekLiftStatus
  };

  return response;
}

module.exports = { lambdaHandler, getCurrentLiftStatus, updateWeeklyLiftStatus, truncateToLastWeek }

// Date Time Helpers

function time() {
  return moment().format('H:mm');
}

function timestamp() {
  return moment().valueOf();
}

function date() {
  return moment().format('YYYY-MM-DD');
}

// External Data reader / writers

async function fetchTerrainStatusJson() {
  const terrainStatus = await axios.get(terrain_status_api_url);
  return terrainStatus.data;
}

async function getLastWeekLiftOpeningTimesJson() {
  return await s3Get('opening_times.json');
}

function updateLastWeekLiftOpeningTimesJson(json_data) {
  s3Write('opening_times.json', json_data);
}

function updateTerrainStatusJson(json_data) {
  s3Write('terrain_status.json', json_data);
}

// S3 Helpers

function s3Get(filename, callback) {
  return new Promise((resolve, reject) => {
    s3.getObject(
      {
        ...S3Params,
        Key: filename
      },
      function(err, data) {
        if (err || !data) reject(new Error(err));

        const jsonData = JSON.parse(data.Body.toString());
        resolve(jsonData);
      }
    );
  });
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
  );
}
