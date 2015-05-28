function getDateTime(){
    var date = new Date();
    return date.getFullYear() 
    + "/" + completeWithZeroes(2, date.getMonth() + 1)  
    + "/" + completeWithZeroes(2, date.getDate())
    + " " + completeWithZeroes(2, date.getHours())
    + ":" + completeWithZeroes(2, date.getMinutes())
    + ":" + completeWithZeroes(2, date.getSeconds())
    + "." + completeWithZeroes(3, date.getMilliseconds());
}

// Over complicating things... ;)
function completeWithZeroes(digits, n){	
  if (digits <= 1) return n;    
	
	var _pow = Math.pow(10, digits - 1);
    
  if (n > _pow) return n;
	
	while(_pow > 1){		        
        var remainder = n/_pow;        
        if(remainder < 1) n = '0' + n;
		_pow /= 10;
	}
	return n;
}

function errorResponse(res, error){
    console.log(error);
    res.json({success: false, message: error});        
}

// Using https://gist.github.com/gordonbrander/2230317
function randomUID() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

module.exports = { 
	getDateTime: getDateTime, 
	errorResponse: errorResponse,
    randomUID: randomUID 
};