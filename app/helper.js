function getDateTime(){
    var date = new Date();
    return date.getFullYear() 
    + "/" + date.getMonth()  
    + "/" + date.getDay()
    + " " + date.getHours()
    + ":" + date.getMinutes()
    + ":" + date.getSeconds()
    + ":" + date.getMilliseconds();
}

function errorResponse(res, error){
    console.log(error);
    res.json({success: false, message: error});        
}

module.exports = { 
	getDateTime: getDateTime, 
	errorResponse: errorResponse 
};