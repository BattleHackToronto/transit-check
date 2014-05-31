/*module.exports = {

	//'url' : 'mongodb://admin:P1S6QzxPETXa@$ayush:$27017/battlehacktoronto' // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
	'url' : 'mongodb://localhost:27017/battlehacktoronto'
};*/

var mongoose = require('mongoose');

module.exports = function(connection_string){
	
	mongoose.connect(connection_string);
	var db = mongoose.connection;
    db.on('error', function(){
            console.log("database could not open");
    });
	db.once('open', function callback () {
            console.log("database open");
	});


};