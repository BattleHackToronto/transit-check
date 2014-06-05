var User = require('./models/user');
var request = require("request");
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
		res.render('notify.ejs');
	});

	// =====================================
	// LOGIN ===============================
	// =====================================

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profileRedirect', // redirect to the secure profile section
		failureRedirect : '/', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.post('/notifySubmit', isLoggedIn, function(req, res){
		var data = "Hey, you have a transit alert from "+req.user.fullname+" for the "+req.body.route+" - "+req.body.direction+" route: "+req.body.transitalert;
		res.redirect('/notifySubmit/'+data);
	});

	app.get('/notifySubmit/:data', isLoggedIn, function(req, res){
		//require the Twilio module and create a REST client
		require("../node_modules/twilio/lib");
var client = require('twilio')('ACfd84484ff7e2ee28734b5f3fb0629d8e', 'ebb9fb707b52dbd197544c8023f2b68c');

//Send an SMS text message
client.sendMessage({

    to:'+15197812145', // Any number Twilio can deliver to
    from: '+12264002188', // A number you bought from Twilio and can use for outbound communication
    body: req.params.data // body of the SMS message

}, function(err, responseData) { //this function is executed when a response is received from Twilio

    if (!err) { // "err" is an error received during the request, if any

        // "responseData" is a JavaScript object containing data received from Twilio.
        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
        // http://www.twilio.com/docs/api/rest/sending-sms#example-1

        console.log(responseData.from); // outputs "+14506667788"
        console.log(responseData.body); // outputs "word to your mother."
        res.redirect('/profileRedirect');
    }
});
	});

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
		request("http://www.kimonolabs.com/api/773xp64k?apikey=748efc029107db65254154caaec4a867", function(err, response, body){
			console.log('Upload successful!  Server responded with:', body);
			res.render('profile.ejs', {
			user : req.user, // get the user out of session and pass to template
			id : req.params.id,
			BusArray : JSON.parse(body)
		});
		})
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