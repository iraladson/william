var fs = require('fs');

function CoccurenceTable(rowsFixed,columnsFixed,incrementFunc){
	var self = this;

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

	this.update = function(string,mode){
		var ipt = string.split(" ");
		var colCheck = mode ? [mode] : string.split(" ")
		
		//update the table with unknown words
		if(!_columnsFixed){
			_addColumns(ipt);
		}
		if(!_rowsFixed) {
			_addRows(ipt)
		}

		//for every word...
		for (var i = 0; i < colCheck.length; i++) {
			var word = colCheck[i];
			//find the matching column...
			for (var j = 0; j < table.columns.length; j++) {
				var column = table.columns[j];

				if(column.val != word) continue;

				//look at every row on the colum
				for (var z = 0; z < table.rows.length; z++) {
					var row = table.rows[z];
					//if the row value is found in the string input, increment that cell in the column
					if(incrementFunc(row.val,column.val,ipt)){
						column.increment(z)
					}
				};
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
				if(j>-1){ console.log("~~TF TEST~~"); console.log(element.val); console.log(word); console.log(element.val == ipt);}
				if (j > -1 && element.val == word) { 
					break;
				} else if(j == set.length-1){
					func(word);
					break;
				}
			};
		};
	}
}

var coccurTable = new CoccurenceTable(false,true,function(row,column,input){
	///*
	return true
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
	*/
});
