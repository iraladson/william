var William = require('./src/classes/William');

var william = new William();

/*william.init();

setTimeout(function () {
	william.respondTo("Do you only want to dance the night away?");
//	william.respondTo("Do you only want to dance the night away?");
}, 2000);*/

var text = "I want to /n go to the /n store. And";

var textArray = text.split("/n");
console.log(textArray);