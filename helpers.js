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

  const checkUserAuth = function(db,email,password){
    for(const user in db){
      if(email === db[user].email){
        if(password === db[user].password){
          return {error:null,user}
        }else{
          return {error:password,user:null}
        }
    }
  }
    return {error:email,user:null};
  }

  const checkUser = function(db,email){
    for(const user in db){
      if(db[user].email === email){
      return db[user];
      }
    }
  }
  const urlsForUser = function(db,id){
    const URLs ={}
    for(let shortURL in db){
      if(id === db[shortURL].userID ){
      URLs[shortURL] = db[shortURL];
      }
      
    }
    return URLs; 
  }
   

  

  module.exports = {addNewUser,generateRandomString,generateRandomId,checkUser,checkUserAuth,urlsForUser};