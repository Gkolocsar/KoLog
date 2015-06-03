// BASE SETUP
// =============================================================================

// call the packages we need
//var fs         = require('fs');
//var _          = require('underscore');
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var http       = require('http').Server(app);
var io         = require('socket.io')(http);

var bodyParser = require('body-parser');

var mongoose   = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/traces'); // connect to our database
mongoose.connect('mongodb://kolog:kolog123@ds037262.mongolab.com:37262/traces');

var TraceLine  = require('./app/models/traceLine.js');
var UserId     = require('./app/models/userId.js');
var Helper     = require('./app/helper.js');

// START THE SERVER
// =============================================================================

var port = process.env.PORT || 3000;        // set our port

http.listen(port, function(){    
    
    console.log('Listening to port: ' + port);
});

// SOCKET IO
// =============================================================================
io.on('connection', function(socket){
    
    var id = socket.handshake.query.id;
    
    console.log('IO Connection established. User: ' 
    + id 
    + ' - SocketID : ' 
    + socket.id);
    
    // The user joins it's own ID's room
    socket.join(id);
    
    socket.on('wantHistory', function(msg){                
        
        TraceLine.find({userId: msg}, function(err, traces) {
            if(err){
                console.log("Error fetching the trace lines: " + err.stack); 
            }
                        
            for (var i = 0; i < traces.length; i++) {                
                io.to(id).emit('traceLine', traces[i]);                
            }                       
        });
    }); 
});

// SERVER API
// =============================================================================

// Middleware to parse the JSON body
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
      
  res.end('--------------------------------=KoLog=----------------------------------'
  + '\n[[====================The future belongs to the MAD====================]]'
  + '\n\n* Use /start to get an ID and start using KoLog'
  + '\n* Send the trace logs to  the server using a POST request to /logs/:id'
	+ '\n* The POST body should be {message: STRING, traceLevel: STRING}'
  + '\n* Monitor the trace logs from the web using a GET request to /logs/:id'
  + '\n* Adding ?h=1 to the GET request will request the history for that ID');
    
});

app.use(express.static(__dirname + "/public"));  

// VERBS
// ============================================================================

// Middleware to log requests
app.use(function(req, res, next) {
    console.log('Incoming Request: %s %s', req.method, req.url);
    next();
});

// Middleware to check if the user has a UID
app.use('/logs/:id', function(req, res, next) {
    
    var id = req.params.id;       
    
    checkUser(id, req, res, function() {
       next(); 
    });    
});

app.get('/start', function(req, res) {    
    // Create the Object (mongoDB related)
    var userId = new UserId({ 
        userId: Helper.randomUID(),          
        serverDateTime: Helper.getDateTime() 
    });                                    
        
    // Save the object
    userId.save(function(err){       
       if (err){
          Helper.errorResponse(res, err);
          return; 
       }               
    });
     
    res.json(userId); 
});

app.get('/logs/:id', function (req, res) {
    
    var id = req.params.id;                 
    
    if (!id) {
        Helper.errorResponse(res, 'Incomplete data');
        return;
    }
        
    res.sendFile(__dirname + "/public/index.html");                  
});

app.post('/logs/:id', function (req, res){       
    
    var id = req.params.id;        
    
    req.setEncoding('utf8');
       
    var message = req.body.message;   
    var traceLevel = req.body.traceLevel;
    
    if (!message || !traceLevel){
        Helper.errorResponse(res, 'Incomplete data');
        return;    
    }                 

    // Create the Object (mongoDB related)
    var myTrace = new TraceLine({ 
        userId: id, 
        message: message, 
        traceLevel: traceLevel, 
        serverDateTime: Helper.getDateTime() 
    });       
                         
    // Emit the object using socket.io                         
    io.to(id).emit('traceLine', myTrace);
        
    // Save the object
    myTrace.save(function(err){       
       if (err){
          Helper.errorResponse(res, err);
          return; 
       }               
    });    
    
    // Return the response		
    res.json({success: true});    
    	           
});

function checkUser(id, req, res, callback){		
    UserId.findOne({userId: id}, function(err, userId) {				
        if (err) {										
            Helper.errorResponse(res, err);
            return; 
        }                        
        if (!userId || !userId.userId) {											
            Helper.errorResponse(res, 'Invalid User ID. Please use a valid one. You can request it to /start.');
            return;            
        }
        else {											
            callback();
        }
    });
}

module.exports = {
	Helper: Helper,
	UserDBAccess: UserId,
	checkUser: checkUser
};