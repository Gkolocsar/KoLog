var SocketManager = (function(){          
       
  var init = function(uriData){
    
    var socket = io.connect('', { query: 'id=' + uriData.id });                
      
    if (uriData.requiresHistory == '1'){    
      socket.emit('wantHistory', uriData.id);      
    }
  
    socket.on('traceLine', function(log){
      $("#logTemplate").tmpl(log).appendTo("#logs");			
			$(document).scrollTop($(document).height());            
    });
  };    
  
  return {
    init: init
  };  
})();
