// BASE SETUP
// =============================================================================

// call the packages we need
var fs         = require('fs');
var _          = require('underscore');
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var http       = require('http').Server(app);
var io         = require('socket.io')(http);

var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var TraceLine  = require('./app/models/traceLine.js');

// Server vars

var logs = {};

// START THE SERVER
// =============================================================================

var port = process.env.PORT || 3000;        // set our port

http.listen(port, function(){    
    
    console.log('Listening to port: ' + port);
});

// SOCKET IO
// =============================================================================
io.on('connection', function(socket){
    
    console.log('IO Connection established. User: ' 
    + socket.handshake.query.id 
    + ' - SocketID : ' 
    + socket.id);
    
    // The user joins it's own ID's room
    socket.join(socket.handshake.query.id);    
});

// SERVER API
// =============================================================================
app.get('/', function (req, res) {
      
  res.end('KoLog is running. The future belongs to the MAD.');
    
});  

app.get('/logs/automatic/:id', function (req, res){
    
    var id = req.params.id;
    
    //res.sendFile(__dirname + '/public/index.html');
    
    fs.readFile(__dirname + '/public/index.html', function (err, html) {
        if (err) {
            console.log(err);
            res.writeHead(500);
			res.end();
        }
        
        html = html.toString().replace('%ID%', id);
        
        res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write(html);  
        res.end();
    });    
});

app.get('/logs/:id', function (req, res){
    
    var id = req.params.id;
    var userLogs = logs[id];
    
    if(!userLogs){
        body = "There are no logs for this user.";
    } else {
        
        var body = userLogs.map(function(log, i){
        	return log.serverDateTime 
            + ' | ' + log.traceLevel 
            + ' | ' + log.message;
        }).join('\n');
        
    }
	
	res.setHeader('Content-Length', Buffer.byteLength(body));
	res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
	res.end(body);
});

//app.post('/logs/:id', function (req, res){       
//    
//    var id = req.params.id;
//        
//    var message = '';
//	req.setEncoding('utf8');
//	
//	req.on('data', function(chunk){
//		message += chunk;
//	});
//	
//	req.on('end', function(){
//        
//        console.log(id + ': ' + message);                   
//        var serverDateTime = getDateTime();
//        var myTrace = new TraceLine(serverDateTime, 1, message);
//        
//        io.to(id).emit('traceLog', message);                       
//        
//        logs[id] = logs[id] || [];
//		logs[id].push(myTrace);		
//        res.end('OK\n');
//	});           
//});

app.post('/logs/:id', function (req, res){       
    
    var id = req.params.id;
    
    req.setEncoding('utf8');
    
    var message = req.body.message; 
    console.log('message: ' + message);    
    var traceLevel = req.body.traceLevel; 
    console.log('traceLevel: ' + traceLevel.toUpperCase());
    var serverDateTime = getDateTime(); 
    console.log('serverDateTime: ' + serverDateTime);
    var myTrace = new TraceLine(serverDateTime, traceLevel, message);
                         
    io.to(id).emit('traceLine', myTrace);                       
        
    logs[id] = logs[id] || [];
	logs[id].push(myTrace);		
    res.end('OK\n');
    	           
});

function getDateTime(){
    return new Date().toUTCString(); 
}

