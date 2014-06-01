var mongoose = require('mongoose');

var dataSchema = mongoose.Schema({
	bus : {
    busName : String,
    busDir : String,
    stops : Array
  }
});

module.exports = mongoose.model('Data', dataSchema);