var fs = require('fs');



function SyntaxTable(){

	var table = [];

	var jsonForm = { dataTable : table }

	this.extractSyntaxData = function(bmo){
		var sequence = bmo.posSequence;
		var intent = bmo.intent.best;


		for (var i = -1; i < table.length; i++) {
			var tab = table[i] || {};
			var mode = tab.mode;
			var syntaxSequences = tab.sequences;

			if(intent == mode){
				for (var j = 0; j < syntaxSequences.length; j++) {
					var syntaxSequence = syntaxSequences[j];

					if(syntaxSequence.sequence.compare(sequence)){
					
						syntaxSequence.iteration += 1;
						break;

					} else if(j == syntaxSequences.length-1){
						
						var seq = {
							iteration : 1,
							sequence : sequence
						}

						syntaxSequences.push(seq);

						break;
					}
				};

				break;
			} else if(i == table.length-1){

				table.push({
					mode : intent,

					sequences : [{ iteration : 1, sequence : sequence}]
				})

				break;
			}
		};

		return table;
	}

	this.saveTable = function(){
		var name = 'test.json';

		fs.writeFile(name, JSON.stringify(jsonForm, null, 4), function(err){
			if(err) {
				console.log(err);
			} else {
				console.log("JSON saved to " + name);
			}
		})
	}

//	return table;
}


Array.prototype.compare = function (array) {
	    // if the other array is a falsy value, return
	    if (!array)
	        return false;

	    // compare lengths - can save a lot of time
	    if (this.length != array.length)
	        return false;

	    for (var i = 0, l=this.length; i < l; i++) {
	        // Check if we have nested arrays
	        if (this[i] instanceof Array && array[i] instanceof Array) {
	            // recurse into the nested arrays
	            if (!this[i].compare(array[i]))
	                return false;
	        }
	        else if (this[i] != array[i]) {
	            // Warning - two different object instances will never be equal: {x:20} != {x:20}
	            return false;
	        }
	    }
	    return true;
	}

//test
var sTable = new SyntaxTable();
sTable.extractSyntaxData({intent : { best : "working"}, posSequence : ['n','v','j','n']});
sTable.extractSyntaxData({intent : { best : "working"}, posSequence : ['n','v','j','n']});
sTable.extractSyntaxData({intent : { best : "working1"}, posSequence : ['n','v','j','n']});


sTable.saveTable();

//module.exports = SyntaxTable