const AWS = require('aws-sdk');
const fetch = require("node-fetch");

const s3 = new AWS.S3();

exports.lambdaHandler = async (event, context) => {
  const params = {
    Bucket: 'ispeakopenyet',
    Key: 'terrain_status_feed.json',
    Body: fetchterrainStatusJson(),
    ContentType: 'application/json'
  };

  return s3.putObject(params).promise().then(data => {
    console.info(data.Body.toString());
  }).catch(err => {
    console.error("Error calling S3 putObject:", err);
    return Promise.reject(err);
  })
};

function fetchterrainStatusJson() {
  const url = 'https://www.whistlerblackcomb.com/the-mountain/mountain-conditions/terrain-and-lift-status.aspx';
  fetch(url)
    .then(response => response.text())
    .then(page_html => {
      var terrain_status_json = page_html.match(/TerrainStatusFeed[^{]*(.*);/g);
      console.info(terrain_status_json);
      return terrain_status_json;
    });
}
