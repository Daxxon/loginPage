
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mustacheExpress = require('mustache-express');

const app = express();
const morgan = require("morgan");
let users = [
  {username: 'daxxon', password: 'bojangles'},
  {username: 'guest', password: 'password'},
  {username: 'admin', password: 'topSecret'}
];

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// app.use(morgan("tiny"));

app.use(express.static(__dirname));

app.use((req, res, next) => {
  console.log("Your session ID: " + req.session.id);
  console.log("Requesting root URL: " + (req.originalUrl === '/'));
  console.log("There is a user: " + (typeof req.session.username !== 'undefined'));
  console.log("User: " + req.session.user);
  console.log("OriginalUrl with NO user: " + ((req.originalUrl === '/') && (typeof req.session.username === 'undefined')));
  console.log(req.session);
  console.log(req.body);
  if (req.originalUrl === '/' && typeof req.session.username === 'undefined') {
    console.log("REDIRECTING TO LOGIN PAGE");
    res.redirect('/login');
  } else {
    next();
  }
});

app.get('/', (req, res) => {
  res.send(`
    <title>TITLE</title>
    <span>I AM A SPAN</span>
    <span>I AM NOT A P</span>
    `);
});

app.get('/login/', (req, res) => {
  res.render('login', users);
});

app.post('/login', (req, res) => {
  req.session.username = req.body.username;
  console.log("LOGGING IN...");
  res.redirect('/');
});

app.listen(3000, () => console.log('SHOW ME WHAT YOU GOT'));

/*
128.64.32.16.8.4.2.1
*/
