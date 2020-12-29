const { lambdaHandler, getCurrentLiftStatus, updateWeeklyLiftStatus } = require('./app.js');
const MockDate = require('mockdate');

const timestampYesterday = 1609196072656;
const timestampToday     = 1609267661499;

beforeAll(() => {
  MockDate.set(timestampToday);
});

afterAll(() => {
  MockDate.reset();
});

const terrainStatus = {
  "Date": "/Date(" + timestampYesterday + ")/",
  "Lifts": [
    {
      "Name": "7th Heaven Express",
      "Status": 0
    },
    {
      "Name": "Big Red Express",
      "Status": 1
    }
  ]
};

const currentLiftStatus = {
  "Date": "" + timestampYesterday,
  "Lifts": {
    "7th Heaven Express": 0,
    "Big Red Express": 1
  }
};

const lastWeekLiftStatus = {
  "lastUpdated": timestampYesterday,
  "2020-12-28": {
    "7th Heaven Express": "9:18",
    "Big Red Express": "8:10"
  }
}

const updatedLastWeekLiftStatus = {
  "lastUpdated": timestampToday,
  "2020-12-28": {
    "7th Heaven Express": "9:18",
    "Big Red Express": "8:10"
  },
  "2020-12-29": {
    "7th Heaven Express": null,
    "Big Red Express": "10:47"
  }
}

test('updateWeeklyLiftStatus(currentLiftStatus, lastWeekLiftStatus)', () => {
  const result = updateWeeklyLiftStatus(currentLiftStatus, lastWeekLiftStatus);
  const expectedResult = updatedLastWeekLiftStatus;

  expect(result).toEqual(expectedResult);
});

test('getCurrentLiftStatus(terrainStatus)', () => {
  const result = getCurrentLiftStatus(terrainStatus);
  const expectedResult = currentLiftStatus;

  expect(result).toEqual(expectedResult);
});

test('truncateToLastWeek(updatedLastWeekLiftStatus)', () => {
  // TODO
  expect(true);
});
