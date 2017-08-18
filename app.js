
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mustacheExpress = require('mustache-express');
const expressValidator = require('express-validator');

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

app.use(expressValidator());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// app.use(morgan("tiny"));

app.use(express.static(__dirname));

app.use((req, res, next) => {
  // console.log(req.session);
  if (req.originalUrl === '/' && typeof req.session.username === 'undefined') {
    console.log("REDIRECTING TO LOGIN PAGE");
    res.redirect('/login');
  } else {
    next();
  }
});

app.get('/', (req, res) => {
  let myUser = {};
  myUser.username = req.session.username;
  myUser.password = req.session.password;
  res.render('index', myUser);
});

app.get('/login/', (req, res) => {
  res.render('login', users);
});

app.post('/login', (req, res) => {
  let myUsername = req.body.username;
  let myPassword = req.body.password;
  // let myUser;

  users.find((user) => {
    if (user.username === myUsername && user.password === myPassword) {
      req.session.username = myUsername;
      req.session.password = myPassword;
      // myUser = users.find((user) => {
      //   return user.username === myUsername;
      // });
      console.log("REDIRECTING TO THE MAIN PAGE");
    }
  });
res.redirect('/');
});

app.listen(3000, () => console.log('SHOW ME WHAT YOU GOT'));

/*
128.64.32.16.8.4.2.1
*/

// console.log(users.find((user) => {
//   return user.username === myUsername;
// }));
//
// console.log(users.find((user) => {
//   return user.password === myPassword;
// }));
