//var mongoose     = require('mongoose');
//var Schema       = mongoose.Schema;

//var BearSchema   = new Schema({
//    name: String
//});

//module.exports = mongoose.model('Bear', BearSchema);

var TraceLine = function (serverDateTime, traceLevel, message){
	var self = this;
	self.serverDateTime = serverDateTime;
	self.message = message;
	self.traceLevel = traceLevel;
};

module.exports = TraceLine;