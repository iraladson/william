var William = require('./src/classes/William');

var william = new William();

william.init();

setTimeout(function () {
	william.respondTo("Jesus is in the sky.")
},3000)
