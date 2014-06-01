var User = require('./models/user');
var Data = require('./data');
var fs = require('fs'), filename = "../Test.txt";


module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {









		/*fs.readFile(filename, 'utf8', function(err, data) {
  if (err) throw err;
  console.log('OK: ' + filename);

  var line = data.trim().split("\n");

  for (var i=0; i < line.length; i++) {
    var name;
    var dir;
    var stops;
    var timeWeekly;
    var timesSat;
    var timesSun;
    for (var j=0; j <6; j++) {
      if (j == 0) {
            name = line[i];
      } else if (j == 1) {
        dir = line[i];
        } else if (j == 2) {
            stops = line[i].split(",");
        } else if (j == 3) {
            var array = line[i].split(",");
            for (var k=1; k < array.length; k++) {
                  timesWeekly[k] = array[k].split("!");
            }
        } else if (j == 4) {
            var array = line[i].split(",");
            for (var k=1; k < array.length; k++) {
                  timeSat[k] = array[k].split("!");
            }
        } else if (j == 5) {
            var array = line[i].split(",");
            for (var k=1; k < array.length; k++) {
                  timesSun[k] = array[k].split("!");
            }
        }
    }

    for (var u=1; u < stops.length; u++) {
      var curStopName = stops[u];
      var timeWeeklyArray;
      var timeSatArray;
      var timesSunArray;
      for (var h=1; h < timesWeekly[u].length; h++) {
        timeWeeklyArray.add(timesWeekly[u][h]);
      }
      for (var h=1; h < timesSat[u].length; h++) {
        timeSatArray.add(timesSat[u][h]);
      }
      for (var h=1; h < timesSun[u].length; h++) {
        timeSunArray.add(timesSun[u][h]);
      }
      Data.bus = {busName : name, busDir : dir, stops = [{"stopName" : curStopName, "timesWeekly" : timeWeeklyArray, "timesSat" : timeSatArray, "timesSun" : timesSunArray}]};
      Data.save();
    }
  }


});*/








		res.render('landingpage.ejs', { message: req.flash('loginMessage') });
	});

	app.get('/about', function(req, res) {
		res.render('about.ejs');
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