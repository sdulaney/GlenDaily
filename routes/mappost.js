var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('mappost', { title: 'Glendaily Map Post' });
});

module.exports = router;
