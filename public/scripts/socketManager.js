
function initSocketManagement(id, h){
	
	var socket = io.connect('', { query: 'id=' + id });            
      
      if (h == '1'){
        
        socket.emit('wantHistory', id);
          
      }

      socket.on('traceLine', function(log){
	  
		    $("#logTemplate").tmpl(log).appendTo("#logs");
                
      });
}