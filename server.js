// BASE SETUP
// =============================================================================

// call the packages we need
var fs         = require('fs');
var _          = require('underscore');
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var http       = require('http').Server(app)
var io         = require('socket.io')(http);

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
        	return log;
        }).join('\n');
        
    }
	
	res.setHeader('Content-Length', Buffer.byteLength(body));
	res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
	res.end(body);
});

app.post('/logs/:id', function (req, res){       
    
    var id = req.params.id;    
    var log = '';
	req.setEncoding('utf8');
	
	req.on('data', function(chunk){
		log += chunk;
	});
	
	req.on('end', function(){
                   
        log = addDateTimePrefix(log);
        console.log(id + ': ' + log);
                             
        io.to(id).emit('traceLog', log);                       
        
        logs[id] = logs[id] || [];
		logs[id].push(log);		
        res.end('OK\n');
	});           
});

function addDateTimePrefix(log){
    return new Date().toUTCString() + ' | ' + log; 
}

