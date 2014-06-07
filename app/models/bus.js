// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');


var busSchema = mongoose.Schema({
	user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

// methods ======================
// generating a hash
busSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
busSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Bus', busSchema);