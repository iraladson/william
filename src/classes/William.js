var fs = require('fs');

var MessageObjGenerator = require("./MessageObjectGenerator.js");
var EMOAPP = require("./EMOAPP.js");
var SyntaxTable = require("./williamSyntaxTable.js");
var CoccurenceTable = require("./williamCoccurenceTable.js");
var WilliamResponse = require("./williamResponse.js");
var WilliamTopics = require("./williamTopics.js");

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


//------------------------------//


function William(){
	
	this.init = function(){
		_setupEmotion();
		_setupTables();
	}

	this.getData = function(string){
		var string = util.removeApostFrom(string);

		console.log("~~getting Data~~~")
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
		syntaxTable.saveTable();
		wordCountTable.saveTable();
		posTable.saveTable();
		posBeforeTable.saveTable();
		posAfterTable.saveTable();
		responseModeTable.saveTable();

		belief.save();
		desire.save();
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
			_formSyntax(responseMode,possibleResponses)

			for (var i = 0; i < possibleResponses.length; i++) {
				var possibleResponse = possibleResponses[i].sequence;
				_placeTopicWord(possibleResponse,topic);
			};

			
		});
		

		//while(response.length == 0){}

		//_updater(response,sentiment.getSentenceSentiment(response),true,[intent,belief,desire]);
	}

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

		for (var j = 0; j < seq.sequence.length; j++) {
			responseSequence.push( new williamResponse.ResponseWord(seq.sequence[j]) );
		};

		array.push({
			probability : (seq.iteration/total),
			sequence : responseSequence
		});
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

}

function _createColumns(table,array){
	for (var i = 0; i < array.length; i++) {
		table.createColumn(array[i]);
	};
}

function _analyzeData(messgObj){
	syntaxTable.extractSyntaxData(messgObj);
	wordCountTable.extractData(messgObj.text);
	posTable.extractData(messgObj.text,messgObj.posSequence);
	responseModeTable.extractData(messgObj.text,messgObj.intent);
	posBeforeTable.extractData(messgObj.text,messgObj.posSequence);
	posAfterTable.extractData(messgObj.text,messgObj.posSequence);
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