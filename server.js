var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');

var index = require('./routes/index');
var session = require('express-session');
var localStrategy = require('passport-local').Strategy;
// var mongoose = require('mongoose'); --replace with pg
// var pg = require('pg');
var User = require('./models/user');
var register = require('./routes/register');
var login = require('./routes/login');

var app = express();

// Mongo setup -- replace with pg postgresql
// var mongoURI = "mongodb://localhost:27017/prime_example_passport";
// var MongoDB = mongoose.connect(mongoURI).connection;
//
// MongoDB.on('error', function (err) {
//    console.log('mongodb connection error', err);
// });
//
// MongoDB.once('open', function () {
//  console.log('mongodb connection open');
// });

// pg.connect(localhost:27017).connection;



app.use(session({
   secret: 'maddon',
   key: 'user',
   resave: true,
   saveUninitialized: false,
   cookie: { maxAge: 900000, secure: false }
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new localStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, function(username, password, done) {
  User.findAndComparePassword(username, password, function(err, isMatch, user){
      if (err) {
        return done(err);
      }

      if (isMatch) {
        // successfully auth the user
        return done(null, user);
      } else {
        done(null, false);
      }
  });
}));

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    if (err) {
      return done(err);
    }
    done(null, user);
  });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', index);
app.use(express.static('public'));

app.use('/register', register);
app.use('/login', login);

app.use('/api', function(req, res, next){
  if (req.isAuthenticated()) {
    next();
  } else {
    res.sendStatus(403);
  }
});

var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log('Listening on port: ', port);
});
