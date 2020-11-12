const { assert } = require('chai');

const { getUserByEmail } = require('../helpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail(testUsers,"user@example.com");
    const expectedOutput = {
      id: "userRandomID", 
      email: "user@example.com", 
      password: "purple-monkey-dinosaur"
    };
    // Write your assert statement here
    assert.deepEqual(user,expectedOutput);
  });
  it('should return undefined with invalid email', function() {
    const user = getUserByEmail(testUsers,"bob@y.com");
    const expectedOutput = undefined;
      
    // Write your assert statement here
    assert.deepEqual(user,expectedOutput);
  });
});