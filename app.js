var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var studentsRouter = require('./routes/students');

var passport = require('passport');
var {BasicStrategy} = require('passport-http');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/', studentsRouter);


// TODO: Middleware for Authentication
passport.use(new BasicStrategy(
  function(username, password, done) {
    // TODO authenticate user
    return done(null, {username: username})
  }
));

module.exports = app;