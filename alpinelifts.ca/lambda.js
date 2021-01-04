const execSync = require('child_process').execSync;

const cmd = 'make deploy'; // lol

function handler(event, context) {
  execSync(cmd);

  const response = {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: { "success": true }
  };

  return response;
}
