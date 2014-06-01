var mongoose = require('mongoose');

var dataSchema = mongoose.Schema({
	bus : {
    busName : String,
    busDir : String,
    stops : Array
  }
});

module.exports = mongoose.model('Data', dataSchema);

/*0 name:_
1 dir:_
2 stops:,_,_,_
3 timesWeekly:,!_!_!_,!_!_!_,!_!_
4 timesSat:,!_!_!_,!_!_!_,!_!_!_
5 timesSun:,!_!_!_,!_!_!_,!_!_!_*/
