function ResponseMode(){};

ResponseMode.prototype.getMode = function(messageObject) {
	var intent = messageObject.intent.best;

	//CHECK FOR NEW WORD

	if(intent == "questYN") return "answrYN"
	if(intent == "questAlt") return "answrAlt"
	if(intent == "questOpen") return "ansrOpen"

	var random = Math.random;
	var selection = ["questYN","questOpen","questAlt","declar","declar","imper"]

	if((intent == "ansrYN") ||(intent == "ansrAlt") || (intent == "ansrOpen")){
		var rand = Math.floor((random * 5));

		return selection[rand];
	}

	var rand = Math.floor((random * 6));
	
	return selection[rand];
};

function _updateMode = function (){

}

module.exports = ResponseMode;