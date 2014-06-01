var mongoose = require('mongoose');
var Stop = require('stop');

var busSchema = mongoose.Schema({
	num : String,
	name : String,
	stops : [Stop]
});

module.exports = mongoose.model('Bus', busSchema);