var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressMongoDb = require('express-mongo-db');

var indexRouter        = require('./routes/index');
var vacancyRouter        = require('./routes/vacancy');
var adminRouter        = require('./routes/admin');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
if(process.env.UPLOADS_DIR) {
  app.use('/uploads', express.static(process.env.UPLOADS_DIR));
}
app.use(expressMongoDb('mongodb://localhost/reqtario'));



// ROUTES
app.use('/', indexRouter);
app.use('/vacancies', vacancyRouter);
app.use('/admin', adminRouter);

app.locals.moment = require('moment');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
