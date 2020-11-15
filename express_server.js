const express = require('express');
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const app = express();
app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
  })
);


const {addNewUser,generateRandomString,getUserByEmail,checkUserAuth,urlsForUser} = require('./helpers');

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

let users = {};

// Home
app.get('/', (req,res) => {
  const key = req.session.user_id;
  if (key) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

// List all URLs
app.get('/urls',(req,res)=>{
  const key = req.session.user_id;
  if (key) {
    const user = users[key];
    const userURLs = urlsForUser(urlDatabase,key);
    const templateVariables = {userId:user,urls:userURLs};
    res.render('urls_index', templateVariables);
  } else {
    res.render('login',{userId:null});
  }
});

// create a new URL
app.post('/urls',(req,res)=>{
  const shortURL = generateRandomString(8);
  const key = req.session.user_id;
  urlDatabase[shortURL] = {longURL:req.body.longURL,userID:key};
  res.redirect(`/urls/${shortURL}`);
});

// gets all created new URLs
app.get('/urls/new',(req,res)=>{
  let key = req.session.user_id;
  let user = users[key];
  const templateVariables = {userId:user};
  if (key) {
    res.render('urls_new',templateVariables);
  } else {
    res.redirect('/login');
  }
});

// gets the register page
app.get('/register', (req,res) =>{
  const key = req.session.user_id;
    const user = users[key];
    const templateVariables = {userId:user};
    res.render("register",templateVariables);
  
});

// registers the user
app.post('/register',(req,res) =>{
  const {email,password} = req.body;
  if (email === "" || password === "") {
    res.sendStatus(400);
  }
  const checkUserInfo = getUserByEmail(users,email);
  if (!checkUserInfo) {
    const userId = addNewUser(users,email,password);
    req.session['user_id'] = userId;
    res.redirect('/urls');
  } else {
    res.sendStatus(400);
  }
});

//gets login page
app.get('/login',(req,res) =>{
  const key = req.session.user_id;
  const user = users[key];
  const templateVariables = {userId:user};
  res.render('login',templateVariables);
});

// users login and set cookie
app.post('/login',(req,res) =>{
  const {email,password} = req.body;
  const checkUserAuthentication = checkUserAuth(users,email,password);
  if (checkUserAuthentication.error) {
    res.sendStatus(401);
  } else {
    const user = getUserByEmail(users,email);
    req.session['user_id'] = user.id;
    res.redirect('/urls');
  }
});

// users logout and clear cookie
app.post('/logout',(req,res) =>{
  req.session = null;
  res.redirect('/urls');
});

// displays longURL and shortURL of specific shortURL
app.get('/urls/:id',(req,res)=>{
  let key = req.session.user_id;
  if (key) {
    const user = users[key];
    const userURLs = urlsForUser(urlDatabase,key);
    const shortURL = req.params.id;
    const longURL = userURLs[shortURL].longURL;
    const templateVariables = {userId:user,longURL,shortURL};
    res.render('urls_show',templateVariables);
  } else {
    res.render('login',{userId:null});
  }
});

// updates the URLs of specific id
app.post('/urls/:id',(req,res) =>{
  let key = req.session.user_id;
  if (key) {
    const shortURL = req.params.id;
    const longURL = req.body.longURL;
    urlDatabase[shortURL] = {longURL,userID:key};
    res.redirect('/urls');
  }
});

//  delete URLs of specific id
app.post('/urls/:shortURL/delete',(req,res) => {
  let key = req.session.user_id;
  if (key) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  }
});

// redirects to longURL(webpage)
app.get('/u/:id',(req,res)=>{
  let key = req.session.user_id;
  if (key) {
    const id = req.params.id;
      const longURL = urlDatabase[id].longURL;
      res.redirect(longURL);
  }
  res.sendStatus(403);
});

app.listen(port,()=>{
  console.log(`server is running on port ${port}`);
});