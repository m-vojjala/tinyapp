const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const {addNewUser,generateRandomString,checkUser,checkUserAuth} = require('./helpers');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const port = 8080;


app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
console.log(users);
  res.render('urls_index', templateVariables);
});

app.get('/urls/new',(req,res)=>{
  const key = req.cookies['user_id'];
  const user = users[key];
 const templateVariables = {userId:user}
  res.render('urls_new',templateVariables)
});

app.post('/urls',(req,res)=>{
  //  console.log(req.body.longURL); 
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
   res.status(400).send("Error");
 }
 const checkUserInfo = checkUser(users,email)
 if(!checkUserInfo){
  const userId = addNewUser(users,email,password);
  res.cookie('user_id',userId);
  res.redirect('/urls')
 }else{
  res.status(400).send("user exists");
 }
});

// Login route

app.get('/login',(req,res) =>{
  const key = req.cookies['user_id'];
 const user = users[key];
 const templateVariables = {userId:user}
  res.render('login',templateVariables);
});

app.post('/login',(req,res) =>{
const {email,password} = req.body;
const checkUserAuthInfo = checkUserAuth(users,email,password)
if(checkUserAuthInfo.error){
  // console.log(checkUserAuthInfo.error);
 res.status(403).send(checkUserAuthInfo.error);
}else{
  const user = checkUser(users,email);
res.cookie('user_id',user.id);
res.redirect('/urls');
}

});

// Logout route
app.post('/logout',(req,res) =>{
res.clearCookie('user_id');
res.redirect('/login')
})

app.get('/urls/:shortURL',(req,res)=>{
const templateVariables = {userId:req.cookies['user_id'],longURL:urlDatabase[req.params.shortURL],shortURL:req.params.shortURL};
res.render('urls_show',templateVariables)
});

app.post('/urls/:id',(req,res) =>{
 const shortURL = req.params.id;
 const longURL = req.body.longURL;
 urlDatabase[shortURL] = longURL;
res.redirect('/urls');
})

app.post('/urls/:shortURL/delete',(req,res) => {
  // console.log(req.params);
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls')

})

app.get('/u/:shortURL',(req,res)=>{ 
   console.log(req.params.shortURL);
  const longURL = urlDatabase[req.params.shortURL];
console.log(longURL);
  res.redirect(longURL)
});


app.listen(port,()=>{
  console.log(`server is running on port ${port}`)
})