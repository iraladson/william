function WilliamTopics (argument) {
	var self = this;

	this.topics = [];
	
	this.updateTopics = function(messageObject){
		//age old topics
		for (var i = topics.length - 1; i >= 0; i--) {
			var topic = topics[i];
			topic.age += 1;

			if(topic.isDead()){
				topics.splice(i,1);
			}
		};

		
	}
}