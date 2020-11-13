const { assert } = require('chai');

const { getUserByEmail,urlsForUser} = require('../helpers');

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
const urlDatabase = {
  "b2xVn2": {longURL:"http://www.lighthouselabs.ca",userID: "userRandomID" },
  "9sm5xK": {longURL:"http://www.google.com",userID: "userRandomID"}
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail(testUsers, "user@example.com");
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
  it('should return object with valid id', function() {
    const user = urlsForUser(urlDatabase, "userRandomID");
    const expectedOutput = {
      "b2xVn2": {longURL:"http://www.lighthouselabs.ca",userID:"userRandomID" },
      "9sm5xK": {longURL:"http://www.google.com", userID:"userRandomID"}
    };
    // Write your assert statement here
    assert.deepEqual(user, expectedOutput);
  });
});