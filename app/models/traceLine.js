var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var traceLineSchema   = new Schema({
	userId: String,
    message: String,
	traceLevel: String,
	serverDateTime: String
});

var TraceLine = mongoose.model('TraceLine', traceLineSchema);

TraceLine.prototype.print = function(){
	console.log(this.serverDateTime 
            + ' | ' + this.traceLevel 
            + ' | ' + this.message);	
};

module.exports = TraceLine;
