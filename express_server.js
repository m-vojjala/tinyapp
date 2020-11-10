const express = require('express');
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser())
const port = 8080;


app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = function(){
 const randomString =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
 return randomString;
}

app.get('/', (req,res) => {
  res.send('Hello!');
});

app.get('/urls.json',(req,res)=>{
res.json(urlDatabase);
});

app.get('/urls',(req,res)=>{
  console.log(req.cookies['username']);
  res.render('urls_index',{username: req.cookies["username"],urls:urlDatabase})
});

app.get('/urls/new',(req,res)=>{
  res.render('urls_new')
});

app.post('/urls',(req,res)=>{
  //  console.log(req.body.longURL);
 const shortURL = generateRandomString();
 urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post('/login',(req,res) =>{
const cookie = req.body.username;
res.cookie("username",cookie);
res.redirect('/urls')
});

app.post('/logout',(req,res) =>{
res.clearCookie('username');
res.redirect('/urls')
})

app.get('/urls/:shortURL',(req,res)=>{
const templateVariables = {username: req.cookies["username"],longURL:urlDatabase[req.params.shortURL],shortURL:req.params.shortURL};
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