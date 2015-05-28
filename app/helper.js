function getDateTime(){
    var date = new Date();
    return date.getFullYear() 
    + "/" + addZ(date.getMonth() + 1)  
    + "/" + addZ(date.getDate())
    + " " + addZ(date.getHours())
    + ":" + addZ(date.getMinutes())
    + ":" + addZ(date.getSeconds())
    + "." + addZ2(date.getMilliseconds());
}

function addZ(n) {
	return n < 10 ? '0'+n : ''+n;
}

function addZ2(n){
	if (n < 10) {
		return '00'+n;
	} else if (n < 100) {
		return '0'+n;
	} else {
		return ''+n;
	}	
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