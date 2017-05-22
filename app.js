/*---------------------------------------------------------------------
  Dependencies
---------------------------------------------------------------------*/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require("express-flash");
var Promise = require("bluebird");
var compression = require('compression');
var helmet = require('helmet')

/*---------------------------------------------------------------------
  App Setup
---------------------------------------------------------------------*/
var app = express();

var sessionStore = new session.MemoryStore;
app.locals.moment = require('moment');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/*---------------------------------------------------------------------
  Middleware
---------------------------------------------------------------------*/
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(compression())
app.use(helmet())
app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('secret'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

/*---------------------------------------------------------------------
  Routes
---------------------------------------------------------------------*/
app.use('/', require('./routes/index'));
app.use('/feed', require('./routes/feed'));

/*---------------------------------------------------------------------
  Error handlers
---------------------------------------------------------------------*/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

/*---------------------------------------------------------------------
  Exports
---------------------------------------------------------------------*/
module.exports = app;
