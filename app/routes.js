var User = require('./models/user');

module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('landingpage.ejs', { message: req.flash('loginMessage') });
	});

	app.get('/about', function(req, res) {
		res.render('about.ejs');
	});


	app.get('/notify', function(req, res) {
		res.render('notify.js');
	});

	// =====================================
	// LOGIN ===============================
	// =====================================

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profileRedirect', // redirect to the secure profile section
		failureRedirect : '/', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.get('/profileRedirect', isLoggedIn, function(req, res) {
		res.redirect('/profile/' + req.user._id);
	});

	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profileRedirect', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.post('/submitBuses', isLoggedIn, function(req, res){
		//var newUser = User.findById(req.user._id);
		//newUser.update()
		//newUser.favBuses.push('routes');
		User.update({_id: req.user._id},{$push:{userBuses:req.body.route}});
		res.redirect('/profile/'+req.user._id);

	});
	app.get('/profile/:id', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user, // get the user out of session and pass to template
			id : req.params.id
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}