var express = require('express');
var router = express.Router();
var sensor = require("node-dht-sensor");
const {spawn} = require('child_process');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/rotate', function(req, res, next) {
  var process = spawn('python',["./coopdoor.py", 
                            req.query.direction, 
                            req.query.rotations]); 
  res.send("OK");
});

module.exports = router;
