var express = require('express');
var router = express.Router();

var data = {
	contacts: {
		list: [
			{
				name: "Bryce Casaje",
				message: "Hello!",
				email: "bryce@bryce.com",
				date: "i dont know..."
			},
		],
	}
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin_index', { title: 'Express', data: data });
});

router.get('/contacts', function(req, res, next) {
  router.use(express.static('public'));
  res.render('admin_contacts', { title: 'Express', data: data});
});

module.exports = router;
module.exports.addContact = function(data) {
	contactList.push(data);
}