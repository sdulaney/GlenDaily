var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  router.use(express.static('public'));
  res.render('map-report', { title: 'GlenDaily ~ Map Report' });
});

module.exports = router;
