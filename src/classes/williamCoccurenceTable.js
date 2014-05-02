var fs = require('fs');

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

		fs.writeFile( __dirname+"/tempjson/"+_name + ".json", JSON.stringify(table, null, 4), function(err){
			if(err) {
				console.log(err);
			} else {
				console.log("JSON saved to " + name);
			}
		})
	}

	this.extractData = function(string,mode){
		var input = string.split(" ");
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
			var word = ipt[i];

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