var fs = require('fs');
var emoapp = require("./EMOAPP.js");

var util = new emoapp.Util();

function CoccurenceTable(name,rowsFixed,columnsFixed,incrementFunc){
	var self = this;

	var _name = name;
	var _columnsFixed = columnsFixed;
	var _rowsFixed = rowsFixed;

	var table = {

		rows : [],

		columns : []
	};

	this.logTable = function(){
		console.log(table.rows);
		console.log(table.columns);
	}

	this.getValue = function(wordVector){
		for (var i = 0; i < table.rows.length; i++) {
			var row = table.rows[i];

			if(row.val == wordVector[0]){
				for (var j = 0; j < table.columns.length; j++) {
					var column = table.columns[j];

					if(column.val == wordVector[1]){
						return row.row[column.id]
					}
				};
			}
		};

		//console.log("no value found in getValue(wordVector)")
		return 0
	}

	this.getRowsByColumn = function(column){
		var id;
		var output = [];

		for (var i = 0; i < table.columns.length; i++) {
			var _column = table.columns[i];
			if(_column.val == column){
				id = _column.id;
				break;
			}
		};

		for (var i = 0; i < table.rows.length; i++) {
			var row = table.rows[i];

			if(row.row[id] > 0){
				output.push(row.val);
			}
		};

		return output;
	}

	this.createRow = function(val){
		table.rows.push({
			val : val,

			row : []
		})

		for (var i = 0; i < table.columns.length; i++) {
			table.rows[table.rows.length-1].row[i] = 0;
		};
	}

	this.createColumn = function(val){
		table.columns.push({
			val : val,

			id : table.columns.length,

			increment : function(rowNumb,func){
				table.rows[rowNumb].row[this.id] += 1; 
			}
		});

		for (var i = 0; i < table.rows.length; i++) {
			table.rows[i].row[table.columns.length-1] = 0
		};
	}

	this.saveTable = function(){
		fs.writeFile( __dirname+"/json/"+_name + ".json", JSON.stringify(table, null, 4), function(err){
			if(err) {
				console.log(err);
			} else {
				console.log("JSON saved to " + name);
			}
		})
	}

	this.loadTable = function(){
		var file = __dirname + "/json/" + name + ".json";

		fs.readFile(file, 'utf8', function (err, data) {
			if (err) {
				console.log('Error: ' + err);
				return;
			}
			if(data){

				var data = JSON.parse(data);				

				for (var i = 0; i < data.columns.length; i++) {
					self.createColumn(data.columns[i].val);
				};

				table.rows = data.rows;

				console.log(name + " table loaded!")
				
			}
		});
	}

	this.extractData = function(string,mode){
		var input = string.split(" ");

		//clean up data
		//remove punctuation
		if(util.hasPunct(input[input.length-1])){
			var s = input[input.length-1];
			input[input.length-1] = s.substring(s.length-1, s.length);
		}

		var columnFilter;

		if(typeof mode == "object" && mode.length){
			columnFilter = mode;
		} else {
			columnFilter = mode ? [mode] : string.split(" ");
		}
		
		//update the table with unknown words
		if(!_columnsFixed){
			_addColumns(input);
		}
		if(!_rowsFixed) {
			_addRows(input)
		}

		//for every word...
		for (var i = 0; i < columnFilter.length; i++) {
			var filter = columnFilter[i];
			//find the matching column...
			for (var j = 0; j < table.columns.length; j++) {
				var column = table.columns[j];

				if(column.val != filter) continue;

				//look at every row on the colum
				for (var z = 0; z < table.rows.length; z++) {
					var row = table.rows[z];

					//if f(current row, current column // current item, input string) returns true, increment that cell in the column
					if(incrementFunc(row,column,input,columnFilter,i)){
						column.increment(z)
					}
				};
			
				break;
			};
		};
	}

	var _addRows = function (ipt){
		_addCells(ipt,table.rows,self.createRow)
	}

	var _addColumns = function (ipt){
		_addCells(ipt,table.columns,self.createColumn)
	}

	var _addCells = function(ipt,set,func){
		for (var i = 0; i < ipt.length; i++) {
			var word = ipt[i].toLowerCase();

			for (var j = -1; j < set.length; j++) {
				var element = set[j];
				//if(j>-1){
					if (j > -1 && element.val == word) { 
						break;
					} else if(j == set.length-1){
						func(word);
						break;
					}
				//}
			}
		}
	}
}

//var coccurTable = new CoccurenceTable(false,true,function(row,column,input){
	///*
	//return true
	//*/
	/*word count
	for (var x = 0; x < input.length; x++) {
		var nearbyWord = input[x];

		if(nearbyWord == column) return true
	}
	*/
	/*word v word
	for (var x = 0; x < input.length; x++) {
		var nearbyWord = input[x];

		if(nearbyWord == row){
			return true;
		}
	};

	return false;
	/
});*/

module.exports = CoccurenceTable