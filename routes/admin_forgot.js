var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin_forgot-password', { title: 'Glendaily Forgot Password' });
});

module.exports = router;
