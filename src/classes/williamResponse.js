function WilliamResponse(){

	this.getMode = function(messageObject){
		var intent = messageObject.intent;

		if(intent == "isQuestYN") return "isAnswrYN"
		if(intent == "isQuestOpen") return "isAnswrOpen"
		if(intent == "isQuestAlt") return "isAnswrAlt"

		var random = Math.random();
		var selection = ["isQuestYN","isQuestOpen","isQuestAlt","isDeclar","isDeclar","isImper"];

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