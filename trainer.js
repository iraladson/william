var fs = require("fs");

var bible;
var bibleText = {};

var loadTable = function(name){
	var file = __dirname + "/src/classes/trainJson/" + name + ".json";

	fs.readFile(file, 'utf8', function (err, data) {
		if (err) {
			console.log('Error: ' + err);
			return;
		}
		
		var data = JSON.parse(data);
		bible = data.bible;
		
		getText();
	});
}

var getText = function(){
	var text = [];
	
	for (var i = 0; i < bible.length; i++) {
		var verse = bible[i];
		if(verse.text == "" || verse.text == " "){
			console.log("continued") 
			continue; 
		} else {
			text.push(verse.text);
		}
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

var getText1 = function(name){
	var file = __dirname + "/src/classes/trainJson/" + name;

	fs.readFile(file, 'utf8', function (err, data) {
		if (err) {
			console.log('Error: ' + err);
			return;
		}

		var text = []
		
		var dataA = data.split("\n");

		for (var i = 0; i < dataA.length; i++) {
			var lineBlah = dataA[i];

			var line = lineBlah.split(": ")

			if(line[1] == null || line[1] == "<Laughter>" || line[1] == "<Laughter> ." || line[1] == "<lipsmack>" || line[1] == "<breathing>" || line[1].indexOf("--") != -1) continue

			text.push(line[1]);
		};

		bibleText.chatText = text;

		saveTable("bibleText");

	});
}

loadTable("bible");