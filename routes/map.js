var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  router.use(express.static('public'));
  fs.readFile("map_points.json", (err, data) => {
  	res.render('map', { title: 'GlenDaily ~ Live Map', data: JSON.parse(data).map});
  });
});

module.exports = router;
