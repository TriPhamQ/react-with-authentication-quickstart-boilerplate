const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

// Get DB Config.
const config = require('./server/config/database');

// Set Database
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

// Database on Connect.
mongoose.connection.on('connected', () => {
  console.log('Connected to Database ' + config.database);
});

// Database on Error.
mongoose.connection.on('error', (err) => {
  console.log('Database Connection Error ' + err);
});

// Get API Routes.
const users = require('./server/routes/users');
const test = require('./routes/test');

const app = express();

// CORS Middleware.
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/users', users);
app.use('/test', test);

// Passport Middleware.
app.use(passport.initialize());
app.use(passport.session());

require('./server/config/passport')(passport);

// Index Route.
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/build/index.html'));
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
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

module.exports = app;
