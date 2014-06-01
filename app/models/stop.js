var mongoose = require('mongoose');

var stopSchema = mongoose.Schema({
	name : String,
	timeWeekly : [String],
	timeSat : [String],
	timeSun : [String]
});

module.exports = mongoose.model('Stop', stopSchema);