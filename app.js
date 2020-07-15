var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var sensor = require("node-dht-sensor");

const MongoClient = require("mongodb").MongoClient
const uri = "mongodb://chickencoop:Welcome1@ds149960.mlab.com:49960/chickencoop";
const interval = (10000 * 60) * .1;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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

function readDHT22() {
  sensor.read(22, 4, function(err, temperature, humidity) {
    if (!err) {
      console.log(`temp: ${(((9/5)*temperature)+32).toFixed(1)}°F, humidity: ${humidity.toFixed(1)}%`);
    }
  });	
}

MongoClient.connect(uri, (err, client) => {
  if (err){
      console.log(err);
  }
  const dbo = client.db("chickencoop");

  setInterval(function(){
    sensor.read(22, 4, function(err, temperature, humidity) {
      if (!err) {        
        var newDate = new Date();
        var dateString = newDate.toUTCString();
        //console.log(`temp: ${(((9/5)*temperature)+32).toFixed(1)}°F, humidity: ${humidity.toFixed(1)}%, timestamp: ${convertUTCDateToLocalDate(new Date(dateString))}`);
        var reading = { tempurature: `${(((9/5)*temperature)+32).toFixed(1)}°F`, humidity: `${humidity.toFixed(1)}%`, timestamp: `${convertUTCDateToLocalDate(new Date(dateString))}`};        
        dbo.collection("Readings").insertOne(reading, function(err, res) {
          if (err) throw err;
          //console.log("1 document inserted");          
        });
      }
    });	
  }, interval);
})

function convertUTCDateToLocalDate(date) {
  var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

  var offset = date.getTimezoneOffset() / 60;
  var hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;   
}

module.exports = app;
