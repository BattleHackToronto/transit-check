// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
// define the schema for our user model
var alertSchema = mongoose.Schema({
	alertName: String, 
	likes: Number,
	creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'} 
});

// methods ======================
// generating a hash
alertSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
alertSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Alert', alertSchema);