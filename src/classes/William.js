var fs = require('fs');

var MessageObjGenerator = require("./MessageObjectGenerator.js");
var EMOAPP = require("./EMOAPP.js");
var SyntaxTable = require("./williamSyntaxTable.js");
var CoccurenceTable = require("./williamCoccurenceTable.js");
var WilliamResponse = require("./williamResponse.js");
var WilliamTopics = require("./williamTopics.js");
var NeuralNet = require("./williamWordPicker.js");

//Forms
var messageObjGen = new MessageObjGenerator();
var williamResponse = new WilliamResponse();
var williamTopics = new WilliamTopics();

//util
var util = new EMOAPP.Util();

//Emotion
var model = new EMOAPP.Core();
var belief = new EMOAPP.Belief();
var intent = new EMOAPP.Intention();
var desire = new EMOAPP.WilliamDesire();
var sentiment = new EMOAPP.SentimentDetector();


//Tables
var syntaxTable = new SyntaxTable();

var wordCountTable = new CoccurenceTable("wordCount",true,false,function(row,column,string){
	return true;
});

var posTable = new CoccurenceTable("posTable",false,true,function(row,column,input,colFilter,colNumb){
	var word = input[colNumb];

	if(word == row.val){
		return true;
	}
});

var responseModeTable = new CoccurenceTable("rpTable",false,true,function(row,column,input,colFilter,colNumb){
	for (var i = 0; i < input.length; i++) {
		var w = input[i];
		if(w == row.val){  return true }
	};
});

var posBeforeTable = new CoccurenceTable("posBeforeTable",false,true,function(row,column,input,colFilter,colNumb){
	var word = input[colNumb + 1];

	if(word && word == row.val){
		return true;
	}
});

var posAfterTable = new CoccurenceTable("posAfterTable",false,true,function(row,column,input,colFilter,colNumb){
	var word = input[colNumb - 1]

	if(word && word == row.val){
		return true;
	}
})

var wordCoccurTable = new CoccurenceTable("wordCoccur",false,false,function(row,column,input,colFilter,colNumb){
	var rWord = row.val;

	for (var i = 0; i < input.length; i++) {
		var word = input[i];

		if(word == rWord && i != colNumb){
			return true;
		}
	};
})

var _getTablesAsArray = function(){
	return [posBeforeTable,posAfterTable,responseModeTable]
}

var _getCount = function(){
	return wordCountTable
}

//nn
var cNN = new NeuralNet("C");
var dNN = new NeuralNet("D");
var eNN = new NeuralNet("E");
var fNN = new NeuralNet("F");
var iNN = new NeuralNet("I");
var jNN = new NeuralNet("J");
var lNN = new NeuralNet("L");
var mNN = new NeuralNet("M");
var nNN = new NeuralNet("N");
var pNN = new NeuralNet("P");
var rNN = new NeuralNet("R");
var sNN = new NeuralNet("S");
var tNN = new NeuralNet("T");
var uNN = new NeuralNet("U");
var vNN = new NeuralNet("V");
var wNN = new NeuralNet("W");
var commaNN = new NeuralNet(",");
var periodNN = new NeuralNet(".");
var eclamNN = new NeuralNet("!");

var nets = [cNN,dNN,eNN,fNN,iNN,jNN,lNN,mNN,nNN,pNN,rNN,sNN,tNN,uNN,vNN,wNN,commaNN,periodNN,eclamNN];


//------------------------------//


function William(){
	
	this.init = function(){
		_setupEmotion();
		_setupTables();
	}

	var i = 0;

	this.getData = function(string){
		var string = util.removeApostFrom(string);

		console.log(i);
		i+=1;
		
		var message = {
			to : "agent",
			from : "other",
			text: string,
			timestamp: new Date()
		};

		_updater(message.text,sentiment.getSentenceSentiment(message.text),false,[intent,belief,desire]);

		//Convert to message Object
		messageObjGen.getMessageObject(message, model,function(messgObj){

			_analyzeData(messgObj);
		});
	}

	this.saveData = function(){
		/*syntaxTable.saveTable();
		wordCountTable.saveTable();
		posTable.saveTable();
		posBeforeTable.saveTable();
		posAfterTable.saveTable();
		responseModeTable.saveTable();*/
		wordCoccurTable.saveTable();

		/*belief.save();
		desire.save();*/
	}

	this.respondTo = function(string){
		var message = {
			to : "agent",
			from : "other",
			text: string,
			timestamp: new Date()
		};

		var responseString = "";
		var possibleResponses;
		var responseMode;
		var topic;

		_updater(message.text,sentiment.getSentenceSentiment(message.text),false,[intent,belief,desire]);

		//Convert to message Object
		messageObjGen.getMessageObject(message, model,function(messgObj){
			//Analyze data
			_analyzeData(messgObj);

			//Set modes and topics
			responseMode = williamResponse.getMode(messgObj);

			williamTopics.updateTopics(messgObj,desire);

			topic = williamTopics.getSentenceTopics(responseMode);

			//Construct Sentence
			possibleResponses = _formSyntax(responseMode);

			for (var i = 0; i < possibleResponses.length; i++) {
				//if(i > 0) break;
				var possibleResponse = possibleResponses[i].sequence;
				_placeTopicWord(possibleResponse,topic);

				for (var x = 0; x < possibleResponse.length; x++) {
					var responseWord = possibleResponse[x];
					if(responseWord.word == topic.word) { continue; }

					var net = _getNet(responseWord.pos);
					var wordCollection = posTable.getRowsByColumn(responseWord.pos);
					var posBefore = (possibleResponse[x-1] ? possibleResponse[x-1].pos : "")
					var posAfter = (possibleResponse[x+1] ? possibleResponse[x+1].pos : "")
					var data = net.pickWord(wordCollection,[posBefore,posAfter,responseMode],_getTablesAsArray,_getCount);

					possibleResponses[i].sequence[x].word = data.word;
					possibleResponses[i].sequence[x].neuroProb = data.prob;
				};

			};
			
			//Cleanup
			//console.log(possibleResponses[0]);
			var possibleStrings = _getStrings(possibleResponses);
			console.log(possibleStrings);

			responseString = possibleStrings[0];

			//give response string back!!
			
		});

		//_updater(response,sentiment.getSentenceSentiment(response),true,[intent,belief,desire]);
	}

	this.train = function(trainingSentences){
		for (var i = 0; i < trainingSentences.length; i++) {
			var sentence = trainingSentences[i];

			var message = {
				to : "agent",
				from : "other",
				text: sentence,
				timestamp: new Date()
			}

			var responseMode;
			var topic;
			var response;

			_updater(message.text,sentiment.getSentenceSentiment(message.text),false,[intent,belief,desire]);

			messageObjGen.getMessageObject(message, model,function(messgObj){
				_analyzeData(messgObj);

				//Set modes and topics
				williamTopics.clearTopics();

				williamTopics.updateTopics(messgObj,desire);

				topics = williamTopics.getTopics();

				response = _formTrainingResponse(messgObj);

				for (var j = 0; j < topics.length; j++) {
					var topic = topics[j];

					for (var x = 0; x < response.length; x++) {
						var responseWord = response[x];
						if(responseWord.word == topic.word) { break; }

						var net = _getNet(responseWord.pos);
						var wordCollection = posTable.getRowsByColumn(responseWord.pos);
						var posBefore = (response[x-1] ? response[x-1].pos : "")
						var posAfter = (response[x+1] ? response[x+1].pos : "")
						net.train(wordCollection,[posBefore,posAfter,messgObj.intent,topic.word],responseWord.word);
					};
				};
			});

		};
	}

}

function _getStrings(possibleResponses){
	var output = [];

	for (var i = 0; i < possibleResponses.length; i++) {
		var pr = possibleResponses[i].sequence;
		var s = "";

		for (var j = 0; j < pr.length; j++) {
			var responseWord = pr[j];
			
			if(j != 0 || j != pr.length-1){
				s += " "
			}

			s += responseWord.word;
		};

		output.push(s);
	};

	return output
}


//training
function _formTrainingResponse(bmo){
	var output = [];
	var words = bmo.sentences[0].words

	for (var i = 0; i < words.length; i++) {
		var word = words[i];
		var pos = bmo.posSequence[i];

		output.push(new williamResponse.ResponseWord(pos));
		output[i].word = word;
	};

	return output;
}

//
function _getNet(pos){

	for (var i = 0; i < nets.length; i++) {
		var net = nets[i];
		if(net.getId() == pos){
			return net
		}
	};
	console.log(pos);
	console.log("no net found in getNet()")
}
function _placeTopicWord(response,topic){
	var svo = "s";
	var placed = false;

	for (var i = 0; i < response.length; i++) {
		var responseWord = response[i];

		//change svo
		if(responseWord.pos == 'V' && svo == 's'){
			svo = 'v'
		} else if (responseWord.pos != 'V' && svo == 'v'){
			svo = 'o'
		}

		//place word in spot depending on pos + svo
		if((responseWord.pos == topic.pos) && (svo == topic.svo)){
			responseWord.word = topic.word;
			placed = true;
		}
	};

	if(!placed){
		console.log('NO TOPIC WORD WAS PLACED')
	}
}

function _formSyntax(responseMode){
	var array = [];
	var sequences = syntaxTable.getTable(responseMode) || [{iteration : 1, sequence : ['N','V','N']}];
	var total = 0;

	//get total count
	for (var i = 0; i < sequences.length; i++) {
		var seq = sequences[i];
		total += seq.iteration;
	};

	//for every posSequence
	for (var i = 0; i < sequences.length; i++) {
		var seq = sequences[i];
		var responseSequence = [];
		
		if(seq.iteration > 1 || responseMode == "isQuestAlt"){
			for (var j = 0; j < seq.sequence.length; j++) {
				responseSequence.push( new williamResponse.ResponseWord(seq.sequence[j]) );
			};

			array.push({
				probability : (seq.iteration/total),
				sequence : responseSequence
			});
		}
	};

	return array;
}

//~~SETUP~~//
//
function _setupEmotion(){
	model.addComponent(intent);
	model.addComponent(belief);
	model.addComponent(desire);
	model.addComponent(sentiment);
	model.linkComponents();

}

function _setupTables(){
	wordCountTable.createRow("amount");

	var posArray = ["C","D","E","F","I","J","L","M","N","P","R","S","T","U","V","W",",","."]
	_createColumns(posTable,posArray)
	_createColumns(posBeforeTable,posArray);
	_createColumns(posAfterTable,posArray);

	var responseArray = ["isDeclar","isImper","isQuestYN","isQuestOpen","isQuestAlt"];
	_createColumns(responseModeTable,responseArray)

	syntaxTable.loadTable();
	wordCountTable.loadTable();
	posTable.loadTable();
	posBeforeTable.loadTable();
	posAfterTable.loadTable();
	responseModeTable.loadTable();
	wordCoccurTable.loadTable();

}

function _createColumns(table,array){
	for (var i = 0; i < array.length; i++) {
		table.createColumn(array[i]);
	};
}

function _analyzeData(messgObj){
	/*syntaxTable.extractSyntaxData(messgObj);
	wordCountTable.extractData(messgObj.text);
	posTable.extractData(messgObj.text,messgObj.posSequence);
	responseModeTable.extractData(messgObj.text,messgObj.intent);
	posBeforeTable.extractData(messgObj.text,messgObj.posSequence);
	posAfterTable.extractData(messgObj.text,messgObj.posSequence);*/
	wordCoccurTable.extractData(messgObj.text);
}

function _updater(sentence,sentiment,self,modules){
	var obj = {};
	obj.sentence = sentence;
	obj.sentiment = sentiment;
	obj.self = self;

	for(var i = 0; i < modules.length; i += 1){
		//console.log(modules[i].getId());
		modules[i].update(obj)
	}

	if(!self) model.process()
}

module.exports = William