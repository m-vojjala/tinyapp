const express = require('express');
const app = express();
const bodyParser = require("body-parser");

const port = 8080;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
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

  res.render('urls_index',{urls:urlDatabase})
});



app.get('/urls/new',(req,res)=>{
  res.render('urls_new')
});

app.post('/urls',(req,res)=>{
  // console.log(req.body);
 const longURL = req.body;
 const shortURL = generateRandomString();
 urlDatabase  = {longURL,shortURL};
  res.redirect('/urls/:shortURL');
})


app.get('/urls/:shortURL',(req,res)=>{
  const shortURL = req.params.shortURL;
const templateVariables = {shortURL:shortURL,longURL:urlDatabase[shortURL]};
res.render('urls_show',templateVariables)
});


app.get('/u/:shortURL',(req,res)=>{
  const shortURL = req.params.shortURL;
  // console.log(req.params.shortURL);
  const longURL = urlDatabase[shortURL];
console.log(longURL);
  res.redirect(longURL)
})




app.listen(port,()=>{
  console.log(`server is running on port ${port}`)
})