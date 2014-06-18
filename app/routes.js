var User = require('./models/user');
var Bus = require('./models/bus');
var Alert = require('./models/alert')
var request = require("request");
var bcrypt   = require('bcrypt-nodejs');
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

	app.get('/addRoutes', isLoggedIn, function(req, res){
		request("http://www.kimonolabs.com/api/773xp64k?apikey=748efc029107db65254154caaec4a867", function(err, response, body){
			var allBuses = [];
			JSON.parse(body).results.collection1.forEach(function(buses){
				allBuses.push(buses.RouteName.text);
			});
			//console.log(allBuses);
			res.render('addRoutes.ejs',{
				user : req.user,
				BusArray : JSON.parse(body),
				allBuses : allBuses
			});
		});
	});

	app.post('/addLikes/:id', isLoggedIn, function(req, res){
		//req.user.alerts.likes++;
		//console.log(req.alert.alertName);
		Alert.findByIdAndUpdate(req.params.id, {$inc:{likes:1}}).exec(function(err, alert){
			if(!err){
				console.log("chimpanzee");
				console.log(alert);
				console.log("pikachu");
				res.redirect('/allAlerts');
			}
			else{
				res.send(err);
			}}); 
	});

	app.get('/allAlerts', isLoggedIn, function(req, res){
		Alert.find({}).exec(function(err, alertStar){
			var allAlerts = [];
			console.log(alertStar);
			alertStar.forEach(function(item){
				console.log("b");
					allAlerts.push(item);
					console.log(allAlerts.length);
				});
			console.log(allAlerts);
			res.render('allAlerts.ejs',{
				allAlerts: allAlerts
				});
			});
					//console.log("zombie");
		

	});

	app.post('/newpassword', isLoggedIn, function(req, res){
		var newpassword = req.body.newpassword;
		console.log(newpassword);
		console.log(bcrypt.hashSync(newpassword, bcrypt.genSaltSync(8), null));
		User.findByIdAndUpdate(req.user._id, {password: bcrypt.hashSync(newpassword, bcrypt.genSaltSync(8), null)}, function(err){
			if(!err){
				res.redirect('/profileRedirect');
			}
			else{
				console.log(err);
				res.redirect('/profileRedirect');
			}
		});
	});

	app.get('/notify', function(req, res) {
		console.log(req.alert);
		res.render('notify.ejs',{
			User: req.user,
			alert: req.alert
		});
	});

	app.get('/busstops', function(req, res){
		request("http://www.kimonolabs.com/api/3sgtp6yo?apikey=748efc029107db65254154caaec4a867&kimbypage=1", function(err, response, body) {
  			console.log(response);
  			res.render('about.ejs');
		});
	});
	// =====================================
	// LOGIN ===============================
	// =====================================

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/allAlerts', // redirect to the secure profile section
		failureRedirect : '/', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));


	//Creating an alert
	app.post('/notifySubmit', isLoggedIn, function(req, res){
		var data = "Hey, you have a transit alert from "+req.user.fullname+" for the "+req.body.route+" - "+req.body.direction+" route: "+req.body.transitalert+". If you found it useful, like "+req.user.fullname+"'s alert.";
			var alert = new Alert;
			alert.alertRoute = req.body.route;
			alert.alertDirection = req.body.direction;
			alert.alertData = req.body.transitalert;
			alert.alertName = data;
			alert.likes = 0;
			alert.creator = req.user;
			alert.userName = req.user.fullname;
			//alert.dateCreated = Date.now;
			alert.save(function(err, alert){
				if(!err){
					res.redirect('/notifySubmit/'+data+'/'+req.body.route);
				}
				else{
					res.send(err);
				}
			});



		    /*User.findByIdAndUpdate(req.user._id, {$push: {alerts: {alertName: data, likes: 0}}},function(err){
      			if(err){
        			console.log(err);
        			res.redirect('/notifySubmit/'+data+'/'+req.body.route);
      			}else{
        			res.redirect('/notifySubmit/'+data+'/'+req.body.route);
      			}
    		});    */
	});

	app.get('/notifySubmit/:data/:bus_route', isLoggedIn, function(req, res){
		//require the Twilio module and create a REST client
		//console.log(data);
		//console.log(bus_route);
		require("../node_modules/twilio/lib");
		var client = require('twilio')('ACfd84484ff7e2ee28734b5f3fb0629d8e', 'ebb9fb707b52dbd197544c8023f2b68c');
		//User.find({userBuses})
	//Send an SMS text message
		User.find({userBuses: req.params.bus_route}).exec(function(err, userStar){
			console.log(userStar);
			if(userStar.length == 1){
				//res.send("Thanks for your initiative. However, currently we do not have any other user subscribed to this route.");
			}
			else{
			userStar.forEach(function(item){
				if(item.phone != req.user.phone){
				console.log(item.phone);
				console.log(req.user.phone);
				client.sendMessage({
				to: item.phone, // Any number Twilio can deliver to
    			from: '+12264002188', // A number you bought from Twilio and can use for outbound communication
    			body: req.params.data // body of the SMS message

			}, function(err, responseData) { //this function is executed when a response is received from Twilio

	    		if (!err) { // "err" is an error received during the request, if any

		        	// "responseData" is a JavaScript object containing data received from Twilio.
		        	// A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
		        	// http://www.twilio.com/docs/api/rest/sending-sms#example-1
		        	console.log(responseData.from); // outputs "+14506667788"
		        	console.log(responseData.body); // outputs "word to your mother."
		        	
    			}
    			else{
    				console.log(err);
    			}
			});
				}

			});}
		});
		res.redirect('/profileRedirect');
	});


	app.get('/profileRedirectDuplicate', isLoggedIn, function(req,res){
		res.redirect('/profile/'+req.query.userid);
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
		var BusArray ;
		var myArr = [];
		request("http://www.kimonolabs.com/api/773xp64k?apikey=748efc029107db65254154caaec4a867", function(err, response, body){
			BusArray = JSON.parse(body).results.collection1;
			var isBusAdded = function(str){
				for(var i = 0; i < req.user.userBuses.length; i++){
					if(str == req.user.userBuses[i]){
						return true;
					}
				}
				return false;
			};
			console.log(req.body.busRoutes);
					if(isBusAdded(req.body.busRoutes) == false){
						myArr.push(String(req.body.busRoutes));
					}
			

		    User.findByIdAndUpdate(req.user._id, {$pushAll: {userBuses: myArr}},function(err){
      			if(err){
        			console.log(err);
        			res.redirect('/addRoutes');
      			}else{
        			res.redirect('/addRoutes');
      			}
    		});    		
		});
	});

	app.post('/removeBuses', isLoggedIn, function(req, res){
		var toBeRemoved = req.body.bus;
		console.log(toBeRemoved);
		var index = req.user.userBuses.indexOf(toBeRemoved);
		console.log(index);
		console.log(req.user.userBuses);
		req.user.userBuses.splice(index, 1);
		console.log(req.user.userBuses);
		if(index > -1){
		User.findByIdAndUpdate(req.user._id, {userBuses: req.user.userBuses}, function(err){
			if(!err){
				res.redirect('/addRoutes');
			}
			else{
				console.log(err);
				res.redirect('/addRoutes');
			}
		});
		//res.redirect('/addRoutes');
			
		}
		//console.log(req.user.userBuses);
		
	});

	app.get('/profile/:id', isLoggedIn, function(req, res) {
		
		request("http://www.kimonolabs.com/api/773xp64k?apikey=748efc029107db65254154caaec4a867", function(err, response, body){
			User.findById(req.params.id).exec(function(err,doc){
				if(!err){
					console.log(req.user._id);
					console.log(req.params.id);
					res.render('profile.ejs', {
					user : doc,
					ownerid: req.user._id, // get the user out of session and pass to template
					id : req.params.id,
					BusArray : JSON.parse(body)})
				}
			});
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