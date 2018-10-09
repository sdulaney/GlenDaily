var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  router.use(express.static('public'));
  if(req.session.isAuthenticated)
	res.redirect("/admin/");
  else
  	res.render('login', { title: 'GlenDaily ~ Login' });
});

module.exports = router;
