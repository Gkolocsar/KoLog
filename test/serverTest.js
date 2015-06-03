var expect = require('chai').expect;
var sinon  = require('sinon');
var server = require('../server.js');
var assert = require('assert');

//function errorResponse(res, error){
//    console.log(error);
//    res.json({success: false, message: error});        
//}

describe("Server", function(){
	var dbStub;
	var helperStub;
	beforeEach(function(){
		dbStub = sinon.stub(server.UserDBAccess, 'findOne');
		helperStub = sinon.stub(server.Helper, 'errorResponse');	
	});
	
	afterEach(function(){
		server.UserDBAccess.findOne.restore();
		server.Helper.errorResponse.restore();
	});
	
	describe("#checkUser(id, req, res, callback)", function(){
		it("should execute callback if user exists", function(){
									
			dbStub.yields(null, {userId: '1', serverDateTime: '2015-06-03'});
						
			server.checkUser('1', null, null, function(err, result){				
				if(err) return err;				
				assert(dbStub.called);				
				assert(helperStub.callCount == 0);								
			});											
		});
	});
	
	describe("#checkUser(id, req, res, callback)", function(){
		it("should send error response if mongoose responds w/error", function(){
			
			var error = 'some db error';
			dbStub.yields(error, null);			
						
			server.checkUser('1', null, null, null);
			assert(helperStub.calledOnce);
			assert(helperStub.calledWithExactly(null, error));											
		});
	});	
	
	describe("#checkUser(id, req, res, callback)", function(){
		it("should send error response if userId doesn't exist", function(){
						
			dbStub.yields(null, null);			
						
			server.checkUser('1', null, null, null);			
			assert(helperStub.calledOnce);
			assert(helperStub.calledWithExactly(null, 'Invalid User ID. Please use a valid one. You can request it to /start.'));											
		});
	});	
});

