var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var index = require('./routes/index');
var session = require('express-session');
// var mongoose = require('mongoose'); --replace with pg
// var pg = require('pg');
var User = require('./models/user');
var register = require('./routes/register');
var login = require('./routes/login');

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

var app = express();

app.use(session({
   secret: 'maddon',
   key: 'user',
   resave: true,
   saveUninitialized: false,
   cookie: { maxAge: 900000, secure: false }
}));

var localStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
   done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err,user){
    if(err) {
      return done(err);
    }
    done(null,user);
  });
});

passport.use('local', new localStrategy({
      passReqToCallback : true,
      usernameField: 'username'
  },
  function(req, username, password, done){
    User.findOne({ username: username }, function(err, user) {
      if (err) {
         throw err
      };

      if (!user) {
        return done(null, false, {message: 'Incorrect username and password.'});
      }

      // test a matching password
      user.comparePassword(password, function(err, isMatch) {
        if (err) {
          throw err;
        }

        if (isMatch) {
          return done(null, user);
        } else {
          done(null, false, { message: 'Incorrect username and password.' });
        }
      });
    });
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', index);
app.use(express.static('./public'));
app.use('/register', register);
app.use('/login', login);

var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log('Listening on port: ', port);
});
