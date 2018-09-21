var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin_index', { title: 'Express' });
});

router.get('tables', function(req, res, next) {
  res.render('admin_tables', { title: 'Express' });
});

module.exports = router;
