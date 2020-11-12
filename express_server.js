const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const {addNewUser,generateRandomString,checkUser,checkUserAuth,urlsForUser} = require('./helpers');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const port = 8080;


app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": {longURL:"http://www.lighthouselabs.ca",userID: "1" },
  "9sm5xK": {longURL:"http://www.google.com",userID: "1"}
};

let users = { 
  1: {
    id: 1, 
    email: "bob@y.com", 
    password: "purple-monkey-dinosaur"
  },
 2: {
    id: 2, 
    email: "Alice@y.com", 
    password: "dishwasher-funk"
  }
}

app.get('/', (req,res) => {
  res.send('Hello!');
});

app.get('/urls.json',(req,res)=>{
res.json(urlDatabase);
});

app.get('/urls',(req,res)=>{
const key = req.cookies['user_id'];
const user = users[key];
 const templateVariables = {userId:user,urls:urlDatabase};
  res.render('urls_index', templateVariables);
});

app.get('/urls/new',(req,res)=>{
  let key = req.cookies['user_id'];
   let user = users[key];
     const templateVariables = {userId:user};
  if(key){
    res.render('urls_new',templateVariables);
  }else{
    res.redirect('/login');
  }     
});

app.post('/urls',(req,res)=>{
 const shortURL = generateRandomString();
 urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

// Register route
app.get('/register', (req,res) =>{
 const key = req.cookies['user_id'];
  const user = users[key];
  const templateVariables = {userId:user}
  res.render("register",templateVariables);
});

app.post('/register',(req,res) =>{
 const {email,password} = req.body;
 if(email === "" || password === ""){
   res.sendStatus(400);
 }
 const checkUserInfo = checkUser(users,email)
 if(!checkUserInfo){
  const userId = addNewUser(users,email,password);
  res.cookie('user_id',userId);
  res.redirect('/urls')
 }else{
  res.sendStatus(400);
 }
});

// Login route
app.get('/login',(req,res) =>{
  const key = req.cookies['user_id'];
 const user = users[key];
 const templateVariables = {userId:user};
  res.render('login',templateVariables);
});

app.post('/login',(req,res) =>{
const {email,password} = req.body;
const checkUserAuthInfo = checkUserAuth(users,email,password)
if(checkUserAuthInfo.error){
 res.sendStatus(403);
}else{
  const user = checkUser(users,email);
res.cookie('user_id',user.id);
res.redirect('/urls');
}
});

// Logout route
app.post('/logout',(req,res) =>{
res.clearCookie('user_id');
res.redirect('/urls');
});

app.get('/urls/:shortURL',(req,res)=>{
const templateVariables = {userId:req.cookies['user_id'],longURL:urlDatabase[req.params.shortURL],shortURL:req.params.shortURL};
res.render('urls_show',templateVariables)
});

app.post('/urls/:id',(req,res) =>{
 const shortURL = req.params.id;
 const longURL = req.body.longURL;
 urlDatabase[shortURL] = longURL;
res.redirect('/urls');
});

 
app.post('/urls/:shortURL/delete',(req,res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls')

})

app.get('/u/:id',(req,res)=>{ 
  const id = req.params.id;
   const longURL = urlDatabase[id].longURL;
  res.redirect(longURL)
});


app.listen(port,()=>{
  console.log(`server is running on port ${port}`)
})