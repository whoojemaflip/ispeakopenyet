const chromium = require('chrome-aws-lambda');

const url = 'https://www.whistlerblackcomb.com/the-mountain/mountain-conditions/terrain-and-lift-status.aspx'

exports.lambdaHandler = async (event) => {
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  // await page.evaluate(() => console.log(`url is ${location.href}`));

  var html = await page.content();
  await browser.close();

  var terrainStatus = html.match(/TerrainStatusFeed[^{]*(.*);/)[1];

  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: terrainStatus
  };

  return response;
}
