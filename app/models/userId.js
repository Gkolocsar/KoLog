var mongoose     = require('mongoose');
//mongoose.set('debug', true);
var Schema       = mongoose.Schema;

var userIdSchema   = new Schema({
	userId: String,    
	serverDateTime: String
});

var UserId = mongoose.model('UserId', userIdSchema);

UserId.prototype.print = function(){
	console.log(this.serverDateTime 
            + ' | ' + this.userId);	
};

module.exports = UserId;