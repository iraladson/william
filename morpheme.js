var natural = require('wordpos').natural,
	tokenizer = new natural.WordTokenizer();

var wordnet = new natural.WordNet();


function MorphemeCore(){

	//private
	var string = "";
	var free;

	//public
	this.initCore = function(word,free){
		string = word;
		free = free;
	}

	this.getString = function(){
		return string;
	}

	this.length = function(){
		return string.length;
	}

	this.isFree = function(){
		return free;
	}

	this.searchArray = function(array,ele){
		if(array.indexOf(ele) == -1){ return false; }

		return array[array.indexOf(ele)]
	}


}


function MorphemeF(word){
	
	this.initCore(word,true);

	//categorization
		//private
		var typeOfArray = [];

		var pos = (function(){
				var array = [];

				wordnet.lookup(word,function(r){
					r.forEach(function(r){
						if(r.lemma === word){ array.push(r.pos) }
					})
				})

				return array;
		})();;

		var synonyms = (function(){
				var array = [];

				wordnet.lookup(word,function(r){
					r.forEach(function(r){
						if(true){ array.push(r.synonyms) };

					})
				})

				return array;
		})();

		var canBeVerbs = [];

		var canDoVerbs = [];

		//public
		this.getPOS = function(){
			return pos;
		}

		this.getSynonyms = function(){
			return synonyms;
		}

		this.isTypeOf = function(word){
			return this.searchArray(typeOfArray,word)
		}

		this.addType = function(word){
			typeOfArray.push(word);
		}

		this.canDo = function(word){
			return this.searchArray(canDoVerbs,word);
		}

		this.canBe = function(word){
			return this.searchArray(canBeVerbs,word);
		}

	//emotional connotation
		//private
		//this will evolve into an object that is a more complex representation of sentiment
		var inherentSentiment = 0; // -1 to 1

		//public
		//add function to interface with emotional model
		//add functions to alter sentimentalConnotation
		this.getSentiment = function(){
			return inherentSentiment;
		}

}

MorphemeF.prototype = new MorphemeCore();
MorphemeF.prototype.constructor = MorphemeF;

var test = new MorphemeF("spirit");
setTimeout(function(){
	console.log(test.getSynonyms());
},1000);