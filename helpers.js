const generateRandomString = function(){
  const randomString =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return randomString;
 }

 const generateRandomId = function(){
   const randomId = Math.floor(Math.random()*1000);
   return randomId;
 }

const addNewUser = function(db,email,password){
  let  userId = generateRandomId();
  const newUser =  {
    id:userId,
     email,
     password
   };
   db[userId] = newUser;
 return userId;
  };

  const checkUser = function(db,email){
    for(const user in db){
      if(db[user].email === email){
      return db[user];
      }
    }
  }
   

  module.exports = {addNewUser,generateRandomString,generateRandomId,checkUser};