// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    email : String,
    password : String,
    fullname : String,
    phone : String,
    likes : Number,
    dislikes : Number,
    userBuses : Array,
    
    /*
    {
    favBuses : 
    {
	    busName : String,
	    stop : Array of {
	    			stopName : String,
	    			timeWeekly : Array,  //of strings
	    			timeSat : Array,  //of strings
					timeSun : Array  //of strings
	    		}
    }}*/
	   
	    
	    	
	    	
	    
    
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);