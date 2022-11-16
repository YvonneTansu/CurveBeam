var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sql = require('mssql');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const config = {
  authentication: {
    options: {
      userName: process.env.DB_USER,
      password: process.env.DB_PWD
    },
    type: "default"
  },
  server: process.env.DB_SERVER,
  options: {
    database: process.env.DB_NAME,
    encrypt: true
  }
};

// create a 'pool' (group) of connections to be used for connecting with our SQL server
// const dbConnectionPool = new Connection(config);
const dbConnectionPool =new sql.ConnectionPool(config)
  .connect()
  .then (pool =>{
      console.log("connected")
      return pool
  })
  .catch(err => console.log("failed to connect", err)); 

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(function(req, res, next) {
  req.pool = dbConnectionPool;
  next();
});

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  // Set allowed server methods
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Set access control headers
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  // Set allowed cookies
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
