var fs = require("fs");
var parseString = require("xml2js").parseString;
var William = require("./src/classes/William.js");


//DATASET TRAINING
var dataset;

var william = new William();
william.init();

var loadTable = function(name){
	var file = __dirname + "/src/classes/trainJson/" + name + ".json";

	fs.readFile(file, 'utf8', function (err, data) {
		if (err) {
			console.log('Error: ' + err);
			return;
		}
		var dataA = JSON.parse(data);
		dataset = dataA;

		getData(dataset.bible)
		william.saveData();

		getData(dataset.chatText);
		william.saveData();
	});
}

var getData = function(dataset){
	for (var i = 0; i < dataset.length; i++) {
		var data = dataset[i];

		william.getData(data);
	};
}

loadTable('trainingText')


/*/LOADING SENTECES TO JSON
var bibleText = {};

var loadTable = function(name){
	var file = __dirname + "/src/classes/trainJson/" + name + ".txt";

	fs.readFile(file, 'utf8', function (err, data) {
		if (err) {
			console.log('Error: ' + err);
			return;
		}
		
		var dataArray = data.split("\",\n\"")
		bibleText.bible = dataArray;		
		
		getText1()
		//saveTable("trainingText");
	});
}

var getText = function(){
	var text = [];
	
	for (var i = 0; i < bible.length; i++) {
		var verse = bible[i];
		var txt = verse.text.trim().split(".")

		for (var j = 0; j < txt.length; j++) {
			var t = txt[j];

			if(t == "" || t == " "){
				console.log("continued") 
				continue; 
			} else {

				text.push(t.trim());
			}


		};
	};
	
	bibleText.texts = text;
	
	getText1('transcript');
}

var saveTable = function(name){

	fs.writeFile( __dirname+ "/src/classes/trainJson/" + name + ".json", JSON.stringify(bibleText, null, 4), function(err){
		if(err) {
			console.log(err);
		} else {
			console.log("JSON saved to " + name);
		}
	})
}

/*var getText1 = function(){

	var text = [];

	var file = __dirname + "/src/classes/trainJson/train.xml";

	fs.readFile(file, 'utf8', function (err, data) {
		if (err) {
			console.log('Error: ' + err);
			return;
		}

		parseString(data,function(err,result){
			for (var i = 0; i < result.conversations.conversation.length; i++) {
				var message = result.conversations.conversation[i].message;

				for (var j = 0; j < message.length; j++) {
					if((message[j].text[0].indexOf(":") == -1) && (message[j].text[0].indexOf("+") == -1) && (message[j].text[0].indexOf("-") == -1) && (message[j].text[0].indexOf("&") == -1) && (message[j].text[0].indexOf("/") == -1) && (message[j].text[0].indexOf("[") == -1) && (message[j].text[0].indexOf(")") == -1) && (message[j].text[0].indexOf("..") == -1) && (message[j].text[0].indexOf("\"") == -1))
					text.push(message[j].text[0]);
				};
			};
			bibleText.chatText = text;
			saveTable("trainingText");
		});*/
		
		/*var text = []
		
		var dataA = data.split("\n");

		for (var i = 0; i < dataA.length; i++) {
			var lineBlah = dataA[i];

			var line = lineBlah.split(": ")

			if(line[1] == null || line[1] == "<Laughter>" || line[1] == "<Laughter> ." || line[1] == "<lipsmack>" || line[1] == "<breathing>" || line[1].indexOf("--") != -1) continue

			text.push(line[1].trim());
		};

		bibleText.chatText = text;

		saveTable("bibleText");

	});
}

loadTable("bible");*/