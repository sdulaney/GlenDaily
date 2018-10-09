var express = require('express');
var router = express.Router();
var session	= require('express-session');
var storage	= require('node-storage');

var store = new storage("contact_form.json");
var store2 = new storage("map_points.json");

if(!store.get("responses"))
	store.put("responses", []);

if(!store2.get("map"))
	store2.put("map", []);

const SECRET_KEY = "7g,66p!dN3v`|Xr}QR6=I#iA+VVlqA+yP%u(^gUw22&M38j~;Mp.3L7hZ7YSMR.";

router.use(session({
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 3600000}
}));

/* GET home page. */
router.get('/', function(req, res, next) {
  router.use(express.static('public'));

  console.log(req.session);

  if(req.session.isAuthenticated)
	res.render('admin', { title: 'GlenDaily ~ Admin Panel', len1: store.get("responses").length, len2: store2.get("map").length});
  else
  	res.redirect("/login/");
});

router.get('/contact', function(req, res, next) {
  router.use(express.static('public'));

  console.log(req.session);

  if(req.session.isAuthenticated)
	res.render('admin_contact', { title: 'GlenDaily ~ Admin Contact Form', data: store.get("responses").reverse()});
  else
  	res.redirect("/login/");
});

router.get('/map', function(req, res, next) {
  router.use(express.static('public'));

  console.log(req.session);

  if(req.session.isAuthenticated)
	res.render('admin_map', { title: 'GlenDaily ~ Live Map Form', data: store2.get("map").reverse()});
  else
  	res.redirect("/login/");
});

router.get('/logout', function(req, res, next) {
  router.use(express.static('public'));

  req.session.destroy();
  res.redirect("/?logout=1");
});

module.exports = router;

module.exports.addResponse = function(obj) {
	var prev = store.get('responses');
	prev.push(obj);
	store.put('responses', prev);
}

module.exports.removeResponse = function(index) {
	var obj = store.get('responses');
	obj.splice(index, 1);
	store.put('responses', obj);
}

module.exports.removeMap = function(index) {
	var obj = store2.get('map');
	obj.splice(index, 1);
	store2.put('map', obj);
}

module.exports.addPoint = function(obj) {
	var prev = store2.get('map');
	prev.push(obj);
	store2.put('map', prev);
}