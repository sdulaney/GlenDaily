var express = require('express');
var router = express.Router();

var data = {
	contacts: {
		list: [
		],
		date: new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
	}
}

/* GET home page. */
router.get('/', function(req, res, next) {
  router.use(express.static('public'));
  res.render('admin_index', { title: 'Glendaily Admin', data: data, layout: false});
});

router.get('/contacts', function(req, res, next) {
  router.use(express.static('public'));
  res.render('admin_contacts', { title: 'Glendaily Contacts', data: data, layout: false});
});

module.exports = router;
module.exports.addContact = function(resp) {
	data.contacts.list.push(resp);
	data.contacts.date = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
}