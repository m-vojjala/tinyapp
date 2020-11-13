const bcrypt = require('bcrypt');
const saltRounds = 10;

const generateRandomString = function(length) {
  const randomString =  Math.random().toString(20).substring(2, length);
  return randomString;
};

const generateRandomId = function() {
  const randomId = Math.floor(Math.random() * 1000);
  return randomId;
};

const addNewUser = function(db,email,password) {
  let  userId = generateRandomId();
  const newUser =  {
    id:userId,
    email,
    password:bcrypt.hashSync(password,saltRounds)
  };
  db[userId] = newUser;
  return userId;
};

const checkUserAuth = function(db,email,password) {
  for (const user in db) {
    if (email === db[user].email) {
      if (bcrypt.compareSync(password,db[user].password)) {
        return {error:null,user};
      } else {
        return {error:password,user:null};
      }
    }
  }
  return {error:email,user:null};
};

const getUserByEmail = function(db,email) {
  for (const user in db) {
    if (db[user].email === email) {
      return db[user];
    }
  }
};

const urlsForUser = function(db,id) {
  const URLs = {};
  for (let shortURL in db) {
    if (id === db[shortURL].userID) {
      URLs[shortURL] = db[shortURL];
    }
      
  }
  return URLs;
};
   

  

module.exports = {addNewUser,generateRandomString,generateRandomId,getUserByEmail,checkUserAuth,urlsForUser};