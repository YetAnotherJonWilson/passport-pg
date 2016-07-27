var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');


router.get("/", function(req,res,next){
  res.sendFile(path.resolve(__dirname, '../public/views/login.html'));
});


router.post('/',
  passport.authenticate('local', {
    successRedirect: '/views/index.html',
    failureRedirect: '/views/failure.html'
  })
);

router.get('/', function(req, res, next) {
  res.json(req.isAuthenticated());
});


module.exports = router;
