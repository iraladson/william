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

	this.respondTo = function(string){
		var message = {
			to : "agent",
			from : "other",
			text: string,
			timestamp: new Date()
		};

		var response = "";
		var responseMode;

		_updater(message.text,sentiment.getSentenceSentiment(message.text),false,[intent,belief,desire]);

		//Convert to message Object
		messageObjGen.getMessageObject(message, model,function(messgObj){
			//Analyze data
			_analyzeData(messgObj);

			//set modes and topics
			responseMode = williamResponse.getMode(messgObj);

			williamTopics.updateTopics(messgObj,desire);

			williamTopics.getSentenceTopics(responseMode);
		});
		

		//while(response.length == 0){}

		//_updater(response,sentiment.getSentenceSentiment(response),true,[intent,belief,desire]);
	}

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

	var responseArray = ["isDeclar","isImper","isQuestYN","isQuestOpen","isQuestAlt"];
	_createColumns(responseModeTable,responseArray)

	_createColumns(posBeforeTable,posArray);

	_createColumns(posAfterTable,posArray);
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