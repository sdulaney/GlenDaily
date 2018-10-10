var createError 			= require('http-errors');
var express 				= require('express');
var path 					= require('path');
var cookieParser 			= require('cookie-parser');
var logger 					= require('morgan');
var bodyParser 				= require('body-parser');
var storage					= require('node-storage');
var crypto 					= require('crypto');
var session					= require('express-session');

//yes, i know i put the salt and key online.
//but, there are no passwords or user information stored on this.
//so nothing can be compromised ;)
//this is a presentation anyway, we just need to put this on herokuapp :D
//
//login information: email: antiteal@gmail.com password: password
//
const SECRET_SALT = "fA{ns)0mU0'D?q00Xd;2<r0'P%QA:(oZ_&GRb.vbZ3.({HP)B!,GLXb<ArUeC^";
const SECRET_KEY = "7g,66p!dN3v`|Xr}QR6=I#iA+VVlqA+yP%u(^gUw22&M38j~;Mp.3L7hZ7YSMR.";

const sha256 = x => crypto.createHash('sha256').update(SECRET_SALT + x, 'utf8').digest('hex');

var app = express();
app.use(session({
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 3600000}
}));
var store = new storage('login_info.json');

if(!store.get("users"))
	store.put("users", {});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

var adminRouter = require('./routes/admin');

//all the routes baby
app.use('/', require('./routes/index'));
app.use('/contact/', require('./routes/contact'));
app.use('/faq/', require('./routes/faq'));
app.use('/login/', require('./routes/login'));
app.use('/map/', require('./routes/map'));
app.use('/map_report/', require('./routes/map_report'));
app.use('/register/', require('./routes/register'));
app.use('/admin/', adminRouter);

app.post("/api/mappost", function(req, res) {
	try {
		var response = req.body;

		var obj = {
			type: encodeURIComponent(response.type),
			name: encodeURIComponent(response.name),
			subject: encodeURIComponent(response.subject),
			desc: encodeURIComponent(response.desc),
			date: +new Date()
		}

		var coords = response.coords.split(",");
		obj.x = parseFloat(coords[0].trim()), obj.y = parseFloat(coords[1].trim());

		adminRouter.addPoint(obj);

		res.redirect("/map_report/?success=1");
	}
	catch(err) {
		console.log(err);
		res.redirect("/map_report/?success=0");
	}
});

app.post("/api/contact", function(req, res) {
	try {
		var response = req.body;

		var obj = {
			name: response.name,
			subject: response.subject,
			email: response.email,
			message: encodeURIComponent(response.message),
			official: response.official,
			date: +new Date()
		}

		adminRouter.addResponse(obj);

		res.redirect("/contact/?success=1");
	}
	catch(err) {
		console.log(err);
		res.redirect("/contact/?success=0");
	}
});

app.post("/api/admin_removecontact", function(req, res) {
	try {
		if(req.session.isAuthenticated) {
			adminRouter.removeResponse(parseInt(req.body.index));
			res.redirect("/admin/contact");
		}
	}
	catch(err) {
	}
});

app.post("/api/admin_removemap", function(req, res) {
	try {
		if(req.session.isAuthenticated) {
			adminRouter.removeMap(parseInt(req.body.index));
			res.redirect("/admin/map");
		}
	}
	catch(err) {
	}
});

app.post("/api/login", function(req, res) {
	var email = req.body.email;
	var pass = req.body.pass;

	console.log(sha256(pass));

	var users = store.get("users");
	if(users[email]) {
		if(users[email] == sha256(pass)) {
			res.redirect("/admin/");
			req.session.email = email;
			req.session.hash = sha256(pass);
			req.session.isAuthenticated = true;
			req.session.save();
		}
		else
			res.redirect("/login/?failure=2")
	}
	else
		res.redirect("/login/?failure=1")
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.redirect("/?404=1");
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
