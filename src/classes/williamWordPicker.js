function wordPicker (pos,tables,total) {

	var id = pos;

	this.getId = function(){
		return id;
	}
	
	this.pickWord = function(wordCollection,topicWord,mood,posBefore,posAfter,responseMode){

		var bestWord;

		for (var i = 0; i < wordCollection.length; i++) {
			var word = wordCollection[i];
			var probabilities = _getProbabilities(word,topicWord,tables)

			_runNet()//TO DO
		};
	}
}

function _getProbabilities(word,topicWord,tables){
	var probabilities = [];

	for (var i = 0; i < tables.length; i++) {
		var table = tables[i];

		probabilities[i] = _getProbability(table,[word,topicWord]);
	};

	return probabilities;
}

function _getProbability(table,wordVector){
	var value = table.getValue(wordVector);
	var total = total.getTotalValue(wordVector[0]);

	return (value/total);
} 