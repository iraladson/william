
var topics = [];

function WilliamTopics (argument) {
	var self = this;

	this.getTopics = function(){
		return topics;
	}
	
	this.updateTopics = function(messageObject,model){
		//age old topics
		for (var i = topics.length - 1; i >= 0; i--) {
			var topic = topics[i];
			topic.age += 1;

			if(topic.isDead()){
				topics.splice(i,1);
			}
		};

		//based on 
		for (var i = 0; i < messageObject.sentences.length; i++) {
			var sentenceObject = messageObject.sentences[i];
			var svo = 's';

			for (var j = 0; j < sentenceObject.words.length; j++) {
				var word = sentenceObject.words[j];
				var pos = messageObject.posSequence[j];

				if(pos == 'V' && svo == 's'){
					svo = 'v'
				} else if (pos != 'V' && svo == 'v'){
					svo = 'o'
				}

				if(!_isStopWord(word,sentenceObject.stopWords)){
					var config = {};
					config.word = word;
					config.pos = pos;
					config.svo = svo;
					config.intent = messageObject.intent;
					config.interest = _getInterest(word,model);
					topics.push(new _TopicObject(config))
				}

			};
		};
	}

	this.clearTopics = function(){
		topics = [];
	}

	this.getSentenceTopics = function(responseMode){
		var collection;
		
		//responseMode = "isQuestOpen"
		switch(responseMode){
			case "isAnswerYN" 	: collection = _getTopics("isQuestYN");
						break;
			case "isAnswerOpen" : collection = _getTopics("isQuestOpen");
						break;
			case "isAnswerAlt" 	: collection = _getTopics("isQuestAlt");
						break;
			case "isQuestAlt" 	: collection = _getCollectionOfTopics(["isAnswerYN","isAnswerOpen","isAnswerAlt","isDeclar"]);
					//	return _getInterestingTopic(collection);
						break;
			case "isQuestOpen" 	: collection = _getCollectionOfTopics(["isAnswerYN","isAnswerOpen","isAnswerAlt","isDeclar"]);
						break;
			case "isQuestYN" 	: collection = _getCollectionOfTopics(["isAnswerYN","isAnswerOpen","isAnswerAlt","isDeclar"]);
						break;
			case "isDeclar" 	: collection = _getCollectionOfTopics(["isAnswerYN","isAnswerOpen","isAnswerAlt","isDeclar","isQuestYN","isQuestOpen","isQuestAlt"]);
						break;
			case "isImper" 		: collection = _getCollectionOfTopics(["isImper","isDeclar"])
						break;
		}

		if(!collection){
			collection = [];
		}

		return _getInterestingTopic(collection);
	}
}

function _TopicObject(config){
	var self = this;

	this.word = config.word;
	this.age = 0;
	this.svo = config.svo;
	this.pos = config.pos;
	this.intent = config.intent;
	this.interest = config.interest;
	this.isDead = function(){
		if(self.age - (self.interest * 4) > 3){
			return true;
		}
	}
}

function _getInterest(word,desire){
	var _desire = desire.getDesireByParam(word);

	if(_desire){
		return _desire.magnitude;
	} else {
		return 0;
	}
}

function _isStopWord(word,stopWords){
	for (var i = 0; i < stopWords.length; i++) {
		var sWord = stopWords[i];

		if(sWord.toLowerCase() == word.toLowerCase()){
			return true
		}
	};
}

function _getTopics(intent){
	var collection = [];

	for (var i = 0; i < topics.length; i++) {
		var topic = topics[i]
		
		if(topic.intent == intent){
			collection.push(topic);
		}
	};

	return collection;
}

function _getCollectionOfTopics(intents){
	var collection = [];

	for (var i = 0; i < intents.length; i++) {
		var intent = intents[i];

		collection = collection.concat(_getTopics(intent));	
	};

	return collection;
}

function _getInterestingTopic(topicsArray){
	var mostInterestingValue = 0;
	var mostInterestingIndex = 0;
	for (var i = topicsArray.length-1; i >= 0; i--) {
		var topic = topicsArray[i];

		if(topic.interest > mostInterestingValue){
			mostInterestingIndex = i;
		}
	};

	if(topicsArray[mostInterestingIndex]){
		return topicsArray[mostInterestingIndex];
	}
	
	return topics[mostInterestingIndex];
}



module.exports = WilliamTopics