var express = require('express');
var router = express.Router();
var sensor = require("node-dht-sensor");


/* GET home page. */
router.get('/', function(req, res, next) {
sensor.read(22, 4, function(err, temperature, humidity) {
  if (!err) {
    console.log(`temp: ${(((9/5)*temperature)+32).toFixed(1)}°F, humidity: ${humidity.toFixed(1)}%`);
  }
});	
  res.render('index', { title: 'Express' });
});

module.exports = router;
