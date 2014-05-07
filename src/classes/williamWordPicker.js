var NeuralNet = require("./build/convnet.js") 

function WordPicker (pos,tables) {
	var self = this;

	var id = pos;
	var tables = tables;
	var net = new NeuralNet.Net();

	var layer_defs = [];
	layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:2});
	layer_defs.push({type:'softmax', num_classes:2});
	net.makeLayers(layer_defs);

	this.getId = function(){
		return id;
	}
	
	this.pickWord = function(wordCollection,coulmns){ //columns == posb,posA,rm,topicSentence

		var bestWord;
		var bestProb;

		for (var i = 0; i < wordCollection.length; i++) {
			var word = wordCollection[i];
			var probabilities = _getProbabilities(word,columns,tables);
			var input = NeuralNet.Vol(probabilities)

			var prob = _runNet(input)//TO DO

			if(prob > bestProb){
				bestWord = word;
				bestProb = prob;
			}
		};

		return { prob: bestProb, word: bestWord }
	}
}

	this.train = function(wordCollection,columns,output){

	}

function _getProbabilities(word,columns,tables){
	var probabilities = [];

	for (var i = 0; i < tables.length; i++) {
		var table = tables[i];

		probabilities[i] = _getProbability(table,[word,columns[i]]);
	};

	return probabilities;
}

function _getProbability(table,wordVector){
	var value = table.getValue(wordVector);
	var total = total.getTotalValue(wordVector[0]);

	return (value/total);
} 

module.exports = WordPicker