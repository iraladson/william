var NeuralNet = require("./build/convnet.js") 

function WordPicker (pos) {
	var self = this;

	var id = pos;
	

	var layer_defs = [];
	layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:3});
	layer_defs.push({type:'softmax', num_classes:2});

	var net = new NeuralNet.Net();
	net.makeLayers(layer_defs);

	var trainer = new NeuralNet.Trainer(net, {method: 'adadelta', l2_decay: 0.001, batch_size: 100});

	this.getId = function(){
		return id;
	}
	
	this.pickWord = function(wordCollection,columns,tables,count){ //columns == posb,posA,rm,topicSentence
		var bestWord;
		var bestProb = 0;
		var tables = tables();
		var wordCount = count();

		for (var i = 0; i < wordCollection.length; i++) {
			var word = wordCollection[i];
			var probabilities = _getProbabilities(word,columns,tables,wordCount);
			var input = new NeuralNet.Vol(1,1,3);
			input.w[0] = probabilities[0];
			input.w[1] = probabilities[1];
			input.w[2] = probabilities[2];

		

			var prob = net.forward(input)//TO DO
			if(prob.w[1] > bestProb){
				bestWord = word;
				bestProb = prob.w[1];
			}
		};

		return { prob: bestProb, word: bestWord }
	}
}

	this.train = function(wordCollection,columns,output){
		console.log("~~NET: "+id+"~~");
		for (var i = 0; i < wordCollection.length; i++) {
			var word = wordCollection[i];
			var probabilities = _getProbabilities(word,columns,tables,wordCount);
			var input = new NeuralNet.Vol(probabilities);
			var cost;

			if(word == output){
				cost = trainer.train(input,1);
			} else {
				cost = trainer.train(input,0)
			}

			console.log(cost);
		}
	}

function _getProbabilities(word,columns,tables,wordCount){
	var probabilities = [];

	for (var i = 0; i < tables.length; i++) {
		var table = tables[i];

		probabilities[i] = _getProbability(table,[word,columns[i]],wordCount);
	};

	return probabilities;
}

function _getProbability(table,wordVector,wordCount){
	var value = table.getValue(wordVector);
	var total = wordCount.getValue(["amount",wordVector[0]]);
	return (value/total);
} 

module.exports = WordPicker