var mongoose = require('mongoose');
var Stop = require('./stop');

var busSchema = mongoose.Schema({
	num : String,
	name : String,
	stops : [Stop]
});

module.exports = mongoose.model('Bus', busSchema);


/*var fs = require('fs'), filename = "Test.txt";
fs.readFile(filename, 'utf8', function(err, data) {
  if (err) throw err;
  console.log('OK: ' + filename);

  var line = data.trim().split("\n");

  for (var i=0; i < line.length; i++) {
  	var num;
  	var name;
  	var stops;
  	var timeWeekly;
  	var timesSat;
  	var timesSun;
  	for (var j=0; j <6; j+++) {
  		if (j == 0) {
  			num = line[i];
  		} else if (j == 1) {
  			name = line[i];
  		} else if (j == 2) {
  			stops = line[i].split(",");
  		} else if (j == 3) {
  			var array = line[i].split(",");
  			for (var k=0; k < array.length; k++) {
				timesWeekly[k] = array[k].split("!");
  			}
  		} else if (j == 4) {
  			var array = line[i].split(",");
  			for (var k=0; k < array.length; k++) {
				timeSat[k] = array[k].split("!");
  			}
  		} else if (j == 5) {
  			var array = line[i].split(",");
  			for (var k=0; k < array.length; k++) {
				timesSun[k] = array[k].split("!");
  			}
  		} 
  	}
  }


});

0 num:_
1 name:_
2 stops:,_,_,_
3 timesWeekly:,!_!_!_,!_!_!_,!_!_
4 timesSat:,!_!_!_,!_!_!_,!_!_!_
5 timesSun:,!_!_!_,!_!_!_,!_!_!_*/
