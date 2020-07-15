var express = require('express');
var router = express.Router();
var sensor = require("node-dht-sensor");
const {spawn} = require('child_process');

const path = require('path')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/readSensor', function(req, res, next) {
  sensor.read(22, 4, function(err, temperature, humidity) {
    if (!err) {
      res.send({
        "Tempurature" : (((9/5)*temperature)+32).toFixed(1) + "°F", 
        "Humidity" : humidity.toFixed(1) + "%"
      })
    }
  });  
});

/* GET home page. */
router.get('/rotate', function(req, res, next) {
  
  var dataToSend;
  // spawn new child process to call the python script
  const python = spawn('python', [path.join(__dirname, 'coopdoor.py'),                              
                                    req.query.rotations,
                                    req.query.direction]);
  // collect data from script
  python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataToSend = data.toString();
  });
  // in close event we are sure that stream from child process is closed
  python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    res.send(dataToSend);
  });
});



module.exports = router;
