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
mongoose.connect('mongodb://localhost:27017/traces'); // connect to our database

var TraceLine  = require('./app/models/traceLine.js');
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

// Middleware to log requests
app.use(function(req, res, next) {
    console.log('Incoming Request: %s %s', req.method, req.url);
    next();
});

app.get('/', function (req, res) {
      
  res.end('KoLog is running. The future belongs to the MAD.');
    
});

app.use(express.static(__dirname + "/public"));  

app.get('/logs/automatic/:id', function (req, res){
    
    var id = req.params.id;                 
    
    if(!id){
        Helper.errorResponse(res, 'Incomplete data');
        return;
    }
    
    res.sendFile(__dirname + "/public/index.html");   
});

app.get('/logs/:id', function (req, res){
    
    var id = req.params.id;
    
    if(!id){
        Helper.errorResponse(res, 'Incomplete data');
        return;
    }                           

    TraceLine.find({userId: id}, function(err, traces) {
        if(err){
            Helper.errorResponse(res, err);
            return; 
        }
        if(traces.length == 0){
        	res.end("There are no logs for this user."); 
        }
        
        var body = traces.map(function(trace){
            return trace.serverDateTime
            + ' | ' + trace.traceLevel
            + ' | ' + trace.message; 
        }).join('\n');
        
        res.end(body);
        //res.json(traces);    
    });	
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