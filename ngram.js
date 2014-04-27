function makeNgram(n,list){
	var ngram = [];

	for (var i = 0; i < list.length - (n-1); i++) {
		var start = list[i];

		var gram = list.splice(i,n+i);
		console.log(gram);
		ngram.push(gram);
	};

	return ngram;
}