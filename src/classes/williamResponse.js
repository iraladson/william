function WilliamResponse(){

	this.getMode = function(messageObject){
		var intent = messageObject.intent;

		if(intent == "isQuestYN") return "answrYN"
		if(intent == "isQuestOpen") return "answrOpen"
		if(intent == "isQuestAlt") return "answrAlt"

		var random = Math.random();
		var selection = ["questYN","questOpen","questAlt","declar","declar","imper"];

		if((intent == "isAnswerYN") || (intent == "isAnswerAlt") || (intent == "isAnswerOpen")){
			var rand = Math.floor(random * 5);
			return selection[rand];
		}

		var rand = Math.floor(random * 6);
		return selection[rand];
	}

	this.ResponseWord = function(pos){
		this.word = "";
		this.pos = pos;
		this.neuroProb = 0;
	}
};

module.exports = WilliamResponse;