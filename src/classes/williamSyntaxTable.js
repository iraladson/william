var fs = require('fs');

function SyntaxTable(){

	var table = [];

	var jsonForm = { dataTable : table }

	this.extractSyntaxData = function(bmo){
		var posSequence = bmo.posSequence;
		var intent = bmo.intent;
		var sequence = [];

		for(var z = 0; z < posSequence; z += 1){
			sequence.push(posSequence[z].type);
		}


		for (var i = -1; i < table.length; i++) {
			var tab = table[i] || {};
			var mode = tab.mode;
			var syntaxSequences = tab.sequences;

			if(intent == mode){
				for (var j = 0; j < syntaxSequences.length; j++) {
					var syntaxSequence = syntaxSequences[j];

					if(_compare(syntaxSequence.sequence,sequence)){
					
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


function _compare (array1,array2) {
	    // if the other array is a falsy value, return
	    if (!array2)
	        return false;

	    // compare lengths - can save a lot of time
	    if (array1.length != array2.length)
	        return false;

	    for (var i = 0, l=array1.length; i < l; i++) {
	        // Check if we have nested arrays
	        if (array1[i] instanceof Array && array2[i] instanceof Array) {
	            // recurse into the nested arrays
	            if (!_compare(array1[i],array2[i]))
	                return false;
	        }
	        else if (array1[i] != array2[i]) {
	            // Warning - two different object instances will never be equal: {x:20} != {x:20}
	            return false;
	        }
	    }
	    return true;
	}

/*/test
var sTable = new SyntaxTable();
sTable.extractSyntaxData({intent : { best : "working"}, posSequence : ['n','v','j','n']});
sTable.extractSyntaxData({intent : { best : "working"}, posSequence : ['n','v','j','n']});
sTable.extractSyntaxData({intent : { best : "working1"}, posSequence : ['n','v','j','n']});


sTable.saveTable();*/

module.exports = SyntaxTable