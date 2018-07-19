var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
let logger = require('morgan');
let mysql = require('mysql');
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let myConnection = require('express-myconnection');
let cors = require('cors');
let multer = require('multer');
let app = express();
let expressSanitizer = require('express-sanitizer');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSanitizer());

app.use('/static', express.static(path.join(__dirname, 'public')));



app.use(function(req, res, next) {
//set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/name', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
});

app.use(function(req, res, next) {
  next(createError(404));
});

let dbOptions = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'database_development'
};

app.use(myConnection(mysql, dbOptions, 'pool'));


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
