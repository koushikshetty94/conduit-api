var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require("dotenv").config();

var indexRouter = require('./routes/api/index');
var apiRouter = require('./routes/api/users');
var articleRouter = require('./routes/api/articles');
var tagRouter = require('./routes/api/tags');

mongoose.connect("mongodb://localhost/conduit3", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err) => {
  console.log(err ? err : "connected to mongodb");
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', indexRouter);
app.use('/api/v1/users', apiRouter);
app.use('/api/v1/articles', articleRouter);
app.use('/api/v1/tags', tagRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
