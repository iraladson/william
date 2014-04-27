var EMOAPP = {};

EMOAPP.AppraisalVar = function(id,br,at){
	var _id = id;
	var magnitude = 0.0;
	var numberOfModifications = 0;
	var representations = [];

	this.bodilyResponse = function(){

		return [magnitude * br[0], magnitude * br[1]] 
	};

	this.actionTendencies = function(){
		return [magnitude * br[0], magnitude * br[1]]
	};

	this.feelings = function(){
		return representations
	}

	this.adjust = function(modifications){
		for(var i = 0; i < modifications.length; i += 1){
			var mod = modifications[i];

			if(mod.id == id){
				numberOfModifications += 1;

				if(mod.val) magnitude += mod.val;

				if(mod.rep) representations.push(mod.rep);
			}
		}
	}

	this.reset = function(){
		magnitude = 0.0;
		numberOfModifications = 0;
		representations = [];
	} 

	this.getInfo = function(){
		return { id : id, mag : magnitude, numb : numberOfModifications, rep : representations}
	}

	this.getPureEmotion = function(){
		return br
	}

	this.synthesize = function(){
		if(numberOfModifications > 0)
			magnitude = (magnitude / numberOfModifications);
	}
}



EMOAPP.Util = function() {
	var that = this;
	//Part Of Speech
	if(Lexer && POSTagger){
		this.PosWord = function(sentWord, sentType){
			this.word = sentWord;
			this.type = sentType;
		}

		this.PosSentence = function(theInput){
			var words = new Lexer().lex(theInput);
			var taggedWords = new POSTagger().tag(words);
			
			this.specialSentence = [];
			for (i in taggedWords) {
				var taggedWord = taggedWords[i];
				var word = taggedWord[0];
				var tag = taggedWord[1].charAt(0);
				this.specialSentence.push(new that.PosWord(word, tag));
			}
		}

		this.identifySVO = function(posSentence){
			var subject = [];
			var verb = [];
			var object = [];
			var index = 0;

			var punct = that.isPunct(posSentence[posSentence.length-1].word);

			//verb check
			for(var i = 0; i < posSentence.length; i+=1){
			var posWord = posSentence[i];
			if(posWord.type == "V"){
				break;
			}
		}
			
			(function(){
				for(var i=index;i<posSentence.length;i += 1){
					if(posSentence[i].type != 'V'){
						subject.push(posSentence[i]);
					} else {
						index = i;
						return;
					}
				}
			})();
			
			(function(){
					verb.push(posSentence[index]);
					
					if(punct){
						verb.push(posSentence[posSentence.length-1]);
					}
					index += 1;
					return;
			})();
			
			(function(){
				for(var i=index;i<posSentence.length;i += 1){
					if(!punct || (punct && i != posSentence.length-1)){
						object.push(posSentence[i]);
					}
				}
			})();

			return { s : subject, v : verb, o : object };
		}

	} else {
		console.log("No part of speech utility");
	}

	//Syntax
	this.isPunct = function(test){
		if(test == "," || this.isEnd(test)){
			return true
		} else {
			return false;
		}
	}

	this.isEnd = function(test){
		if(test == "."){ 
			return "."
		} else if(test == "!"){
			return "!"
		} else if(test == "?"){
			return "?"
		} else if(test == ";"){
			return ";"
		} else {
			return false;
		}
	}

	//general
	this.largestValueInObject = function(obj){
		var max = -1;
		var key;

		for(var i in obj){
			if(obj[i] > max){
				max = obj[i];
				key = i;
			}
		}

		return { key : key, value : max }
	}
}



EMOAPP.Core = function(){
	//COLLECTIONS
	//Populated by Components
	var components = [];

	/* ~~Components~~
	** ==============
	** Components produce appraisal variables
	** They contain their own representations of the agent-enviornment model (aem)
	** They must all contain an 'update function'
	*/

	//@usage: push new components into the components[]
	//@param: comp == component
	this.addComponent = function(comp){
		components.push(comp);
	}

	//@return: obj containing components[] and aems[]
	this.getComponents = function(){
		return { components : components }
	}


	this.process = function(){
		var appVars = createAppraisalVariables();
		var affect = {};
		affect.mood = [0,0];
		affect.feelings = [];

		for(var appVar in appraisalVars){
			var _appVar = appraisalVars[appVar];
			var representation = {};
			
			//mood vector
			_appVar.synthesize();
			var vector = _appVar.bodilyResponse();
			affect.mood[0] += vector[0];
			affect.mood[1] += vector[1];

			//feelings
			var feel = _appVar.feelings();
			for(var i=0; i<feel.length ; i+=1){
				affect.feelings.push({ emotion : appVar, rep : feel[i] });
			}

		}

		affect.mood[0] = (affect.mood[0]/5);
		affect.mood[1] = (affect.mood[1]/5);

		affect.mood[0] = (moodLog[moodLog.length-1][0] + affect.mood[0])/2
		affect.mood[1] = (moodLog[moodLog.length-1][1] + affect.mood[1])/2

		moodLog.push(affect.mood);

        console.log("~~Affect~~");
        console.log(affect);

		return affect
	}

    this.linkComponents = function(){
        for(var i=0; i < components.length; i += 1){
            var component = components[i];
            var dependents = component.getDependents();

            for(var j = 0; j < components.length; j += 1){

                for(var x = 0; x < dependents.length; x += 1){
                    var neededComp = components[j];

                    if(neededComp.getId() == dependents[x]){
                        component.linkComponent(neededComp.getId(),neededComp);
                    }
                }
            }
        }
    }

	/* ~~Appraisal Variables~~
	** =======================
	** Appraisal variables produce emotion and are produced by components.
	*/

	/*
	console.log('~~before new emo.appvar~~');
	console.log("~~EMOAPP~~");
	console.log(EMOAPP);
	*/

	var anger = new EMOAPP.AppraisalVar("anger",[-5,3],[-5,3]);
	var fear = new EMOAPP.AppraisalVar("fear",[-3,5],[-3,5]);
	var happiness =	new EMOAPP.AppraisalVar("happiness",[5,3],[5,3]);
	var sadness = new EMOAPP.AppraisalVar("sadness",[-5,-2],[-5,-2]);
	var surprise = new EMOAPP.AppraisalVar("surprise",[1,5],[1,5]);

	var appraisalVars = { 
		anger : anger,
		fear : fear,
		happiness : happiness,
		sadness : sadness,
		surprise : surprise
	}

	var moodLog = [[0,0]];

	this.getMoodLog = function(){
		return moodLog
	}

	this.getAppraisalVars = function(){
		return appraisalVars
	}

	var createAppraisalVariables = function(){
		//reset all appraisal variables
		for(var key in appraisalVars){
			appraisalVars[key].reset();
		}
		//modify the appVars accodring to the modifications of the components
		for(var i = 0; i < components.length; i += 1){
			var modifications = components[i].getAppraisalVariables();

			for(var key in appraisalVars){
				appraisalVars[key].adjust(modifications);
			}
		}

		//return appVars
		return appraisalVars;
	}
}


String.prototype.removeStopWords = function() {
    var x;
    var y;
    var word;
    var stop_word;
    var regex_str;
    var regex;
    var cleansed_string = this.valueOf();
    var stop_words = new Array(
        'a',
        'about',
        'above',
        'across',
        'after',
        'again',
        'against',
        'all',
        'almost',
        'alone',
        'along',
        'already',
        'also',
        'although',
        'always',
        'among',
        'an',
        'and',
        'another',
        'any',
        'anybody',
        'anyone',
        'anything',
        'anywhere',
        'are',
        'area',
        'areas',
        'around',
        'as',
        'ask',
        'asked',
        'asking',
        'asks',
        'at',
        'away',
        'b',
        'back',
        'backed',
        'backing',
        'backs',
        'be',
        'became',
        'because',
        'become',
        'becomes',
        'been',
        'before',
        'began',
        'behind',
        'being',
        'beings',
        'best',
        'better',
        'between',
        'big',
        'both',
        'but',
        'by',
        'c',
        'came',
        'can',
        'cannot',
        'case',
        'cases',
        'certain',
        'certainly',
        'clear',
        'clearly',
        'come',
        'could',
        'd',
        'did',
        'differ',
        'different',
        'differently',
        'do',
        'does',
        'done',
        'down',
        'down',
        'downed',
        'downing',
        'downs',
        'during',
        'e',
        'each',
        'early',
        'either',
        'end',
        'ended',
        'ending',
        'ends',
        'enough',
        'even',
        'evenly',
        'ever',
        'every',
        'everybody',
        'everyone',
        'everything',
        'everywhere',
        'f',
        'face',
        'faces',
        'fact',
        'facts',
        'far',
        'felt',
        'few',
        'find',
        'finds',
        'first',
        'for',
        'four',
        'from',
        'full',
        'fully',
        'further',
        'furthered',
        'furthering',
        'furthers',
        'g',
        'gave',
        'general',
        'generally',
        'get',
        'gets',
        'give',
        'given',
        'gives',
        'go',
        'going',
        'good',
        'goods',
        'got',
        'great',
        'greater',
        'greatest',
        'group',
        'grouped',
        'grouping',
        'groups',
        'h',
        'had',
        'has',
        'have',
        'having',
        'he',
        'her',
        'here',
        'herself',
        'high',
        'high',
        'high',
        'higher',
        'highest',
        'him',
        'himself',
        'his',
        'how',
        'however',
        'if',
        'important',
        'in',
        'interest',
        'interested',
        'interesting',
        'interests',
        'into',
        'is',
        'it',
        'its',
        'itself',
        'j',
        'just',
        'k',
        'keep',
        'keeps',
        'kind',
        'knew',
        'know',
        'known',
        'knows',
        'l',
        'large',
        'largely',
        'last',
        'later',
        'latest',
        'least',
        'less',
        'let',
        'lets',
        'likely',
        'long',
        'longer',
        'longest',
        'm',
        'made',
        'make',
        'making',
        'man',
        'many',
        'may',
        'me',
        'member',
        'members',
        'men',
        'might',
        'more',
        'most',
        'mostly',
        'mr',
        'mrs',
        'much',
        'must',
        'my',
        'myself',
        'n',
        'necessary',
        'need',
        'needed',
        'needing',
        'needs',
        'never',
        'new',
        'new',
        'newer',
        'newest',
        'next',
        'no',
        'nobody',
        'non',
        'noone',
        'not',
        'nothing',
        'now',
        'nowhere',
        'number',
        'numbers',
        'o',
        'of',
        'off',
        'often',
        'old',
        'older',
        'oldest',
        'on',
        'once',
        'one',
        'only',
        'open',
        'opened',
        'opening',
        'opens',
        'or',
        'order',
        'ordered',
        'ordering',
        'orders',
        'other',
        'others',
        'our',
        'out',
        'over',
        'p',
        'part',
        'parted',
        'parting',
        'parts',
        'per',
        'perhaps',
        'place',
        'places',
        'rather',
        'really',
        'right',
        'right',
        'room',
        'rooms',
        's',
        'said',
        'same',
        'saw',
        'say',
        'says',
        'second',
        'seconds',
        'see',
        'seem',
        'seemed',
        'seeming',
        'seems',
        'sees',
        'several',
        'shall',
        'she',
        'should',
        'show',
        'showed',
        'showing',
        'shows',
        'side',
        'sides',
        'since',
        'so',
        'some',
        'somebody',
        'someone',
        'something',
        'somewhere',
        'state',
        'states',
        'still',
        'still',
        'such',
        'sure',
        't',
        'take',
        'taken',
        'than',
        'that',
        'the',
        'their',
        'them',
        'then',
        'there',
        'therefore',
        'these',
        'they',
        'thing',
        'things',
        'think',
        'thinks',
        'this',
        'those',
        'though',
        'three',
        'through',
        'thus',
        'to',
        'today',
        'together',
        'too',
        'totally',
        'took',
        'toward',
        'turn',
        'turned',
        'turning',
        'turns',
        'two',
        'under',
        'until',
        'up',
        'upon',
        'use',
        'used',
        'uses',
        'v',
        'very',
        'w',
        'want',
        'wanted',
        'wanting',
        'wants',
        'was',
        'way',
        'ways',
        'we',
        'well',
        'wells',
        'went',
        'were',
        'what',
        'when',
        'where',
        'whether',
        'which',
        'while',
        'who',
        'whole',
        'whose',
        'why',
        'will',
        'with',
        'within',
        'without',
        'work',
        'worked',
        'works',
        'would',
        'x',
        'y',
        'year',
        'years',
        'yet',
        'young',
        'younger',
        'youngest',
        'z'
    )
         
    // Split out all the individual words in the phrase
    words = cleansed_string.match(/[^\s]+|\s+[^\s+]$/g)
 
    // Review all the words
    for(x=0; x < words.length; x++) {
        // For each word, check all the stop words
        for(y=0; y < stop_words.length; y++) {
            // Get the current word
            word = words[x].replace(/\s+|[^a-z]+/ig, "");   // Trim the word and remove non-alpha
             
            // Get the stop word
            stop_word = stop_words[y];
             
            // If the word matches the stop word, remove it from the keywords
            if(word.toLowerCase() == stop_word) {
                // Build the regex
                regex_str = "^\\s*"+stop_word+"\\s*$";      // Only word
                regex_str += "|^\\s*"+stop_word+"\\s+";     // First word
                regex_str += "|\\s+"+stop_word+"\\s*$";     // Last word
                regex_str += "|\\s+"+stop_word+"\\s+";      // Word somewhere in the middle
                regex = new RegExp(regex_str, "ig");
             
                // Remove the word from the keywords
                cleansed_string = cleansed_string.replace(regex, " ");
            }
        }
    }
    return cleansed_string.replace(/^\s+|\s+$/g, "");
}



EMOAPP.Intention = function(){
    var id = "Intention"
    var that = this;

    //grab utlities
    var util = new EMOAPP.Util();
    var PosSentence = util.PosSentence;

    //grab dependent components
    var componentLinks = {};
    var dependentComponents = [""];
    
    this.linkComponent = function(id,compo){
        componentLinks[id] = compo;
    }

    this.getDependents = function(){
        return dependentComponents;
    }

    //history
    var log = [];

    //most recent intentions
    var self;
    var other;

    //private constructors
    //Internal Representation on an Intention
    var IntentStruct = function(s,q,d,i,bool){

        this.string = s;

        this.values = {
            isQuestYN  : q.yn,

            isQuestAlt : q.alt,
            
            isQuestOpen : q.open,
            
            isImper : i,
            
            isDeclar : d
        };

        this.own = bool;
    }

    

    //create new intentions
    this.newIntention = function(sentence,selfBool){

        var sent = new IntentSentence(sentence.trim());
        var _self = selfBool || true;
        if(_self){
            self = new IntentStruct(sent.string,sent.isQuestion(),sent.isDeclar(),sent.isImper(),true);

            log.push(new IntentStruct(sent.string,sent.isQuestion(),sent.isDeclar(),sent.isImper(),true));
        } else {
            other = new IntentStruct(sent.string,sent.isQuestion(),sent.isDeclar(),sent.isImper(),false);

            log.push(new IntentStruct(sent.string,sent.isQuestion(),sent.isDeclar(),sent.isImper()),false);
        }
        return log; 
    }

    var IntentSentence = function(sentence){
        var sent = sentence.split(" ");
        var posSent = new PosSentence(sentence).specialSentence;
        var verbFound = false;

        for(var i = 0; i < posSent.length; i+=1){
            var posWord = posSent[i];
            if(posWord.type == "V"){
                verbFound = true;
                break;
            }
        }

        if(!verbFound) posSent[0].type = "V";

        this.string = sentence;

        this.isQuestion = function(){
            var confidence = { yn : 0, alt : 0, open : 0 };

            for(var i = 0; i < sent.length; i++){
                var word = sent[i].toLowerCase();
                
                if(word == "or" || word == "and"){
                    confidence.alt += 0.15;
                }

                
                if((word == "can") ||
                    (word == "did") ||
                    (word == "are") ||
                    (word == "do") ||
                    (word == "does") ||
                    (word == "is") ||
                    (word == "would") ||
                    (word == "should") ||
                    (word == "could") ||
                    (word == "do") ||
                    (word == "will")){
                        if(i == 0){
                            confidence.yn += .5;
                            confidence.alt += .3;
                        } else {
                            confidence.yn += .3;
                            confidence.alt += .2;
                        }
                }

                if((word == "what") ||
                    (word == "where") ||
                    (word == "who") ||
                    (word == "what") ||
                    (word == "which") ||
                    (word == "how") ||
                    (word == "why")){
                        if(i == 0){
                            confidence.open += .5;
                        } else {
                            confidence.open += .3;
                        }
                }

                if(word.indexOf("?") != -1){
                    confidence.yn += .45; 
                    confidence.alt += .45;
                    confidence.open += .45; 
                }
            }

            return confidence;
        }

        this.isDeclar = function(){
            var confidence = 0;

            if(posSent[0].type != "V"){
                confidence += .4;
            }

            if(posSent[posSent.length-1].word == "."){
                confidence += .2;
            }

            return confidence;
        }

        this.isImper = function(){
            var confidence = 0;

            if(posSent[0].type == "V"){
                confidence += .4;
            }

            if(posSent[posSent.length-1].word == "."){
                confidence += .2;
            }

            return confidence;
        }
    }

    //EMOAPPS requires
    this.update = function(obj){
        return this.newIntention(obj.sentence, obj.self);
    }
    

    this.getAppraisalVariables = function(){
        if(!self && !other) 
            return []

        //was a question asked
        var mod1 = {};
        var lastIntentOther = that.getIntent(false);
        var judgementOther = util.largestValueInObject(lastIntentOther.values);
        if((judgementOther.key == "isQuestOpen") || (judgementOther.key == "isQuestAlt") || (judgementOther.key == "isQuestYN")){
            mod1.id = "happiness";
            mod1.val = 0.5;
            mod1.rep = lastIntentOther.string;
        }

        //was a question asked after your question
        var mod2 = {};
        var lastIntentSelf = that.getIntent();
        var judgementSelf = util.largestValueInObject(lastIntentSelf.values);
        if((judgementSelf.key == "isQuestOpen") || (judgementSelf.key == "isQuestAlt") || (judgementSelf.key == "isQuestYN")){
            if(judgementOther.key == "isQuestYN"){
                mod2.id = "anger";
                mod2.val = 0.8;
                mod2.rep = "Responded to question with question"
            } else if(judgementOther.key == "isQuestAlt"){
                mod2.id = "anger"
                mod2.val = 0.5;
                mod2.rep = "Responded to question with question"
            } else if(judgementOther.key == "isQuestAlt"){
                mod2.id = "surprise";
                mod2.val = 0.6;
                mod2.rep = lastIntentOther.string
            }
        }

        return [mod1,mod2];
    }

    //get
    this.getId = function(){
        return id;
    }

    this.getLog = function(){
        return log;
    }
    
    this.getIntent = function(type){
        var _self = type || true;
        
        if(typeof _self == "string"){
            var sent = new IntentSentence(_self.trim());
            return new IntentStruct(sent.string,sent.isQuestion(),sent.isDeclar(),sent.isImper());
        }
        
        if(_self) return self;

        return other;
        
    }

}

EMOAPP.Belief = function(){
    var id = "Belief";
    var that = this;

    //get utilities
    var util = new EMOAPP.Util();
    var PosSentence = util.PosSentence;

    //grab dependent components
    var componentLinks = [];
    var dependentComponents = ["Intention"];
    
    this.linkComponent = function(id,compo){
        componentLinks[id] = compo;
    }

    this.getDependents = function(){
        return dependentComponents;
    }

    //categories of beliefs
    var aboutSelf = [];
    var aboutOther = [];
    var general = [];

    var recentBelief;

    this.newBelief = function(obj){
        //make sure the sentence is declarative
        var intent = componentLinks["Intention"].getIntent(obj.sentence);
        var check = util.largestValueInObject(intent.values).key;

        if(check != "isDeclar") { 
            console.log("no new beliefs: not declarative")
            return 
        }

        /*~~create belief structure from obj~~*/
        var belief = {};
        var svo = util.identifySVO(new PosSentence(obj.sentence).specialSentence);
        //find verb
        belief.verb = svo.v[0].word;
        //find the assertion
        belief.assertion = (function(){
            var string = "";

            for(var i = 0; i < svo.o.length; i += 1){
                string += svo.o[i].word;
                string += " ";
            }

            return string.removeStopWords()

        }())
        //find belief
        belief.subject = (function(){
            var string = "";

            for(var i = 0; i < svo.s.length; i += 1){
                string += svo.s[i].word;
                string += " ";
            }

            return string.removeStopWords()

        }())
        //see if the word 'not' is in the object
        belief.affirmative = (function(){
            for(var i=0; i<svo.o.length; i += 1){
                if(svo.o[i].word == "not"){
                    return false;
                }
            }
            return true;
        }());
        //a sentiment analyisi shoudl be passed in through 'obj' param
        belief.sentiment = obj.sentiment || 0;

        //find the category of the belief
        var _self = obj.self || true;
        var subj = svo.s[0].word;
        var obj = svo.o[0].word;
        
        if((subj.toLowerCase() == "i") || (obj.toLowerCase() == "me") || (obj.toLowerCase() == "mine")) {
            belief.subject = "other";
            aboutOther.push(belief); 
        } else if((subj.toLowerCase() == "you") || (obj.toLowerCase() == "you") || 
                (obj.toLowerCase() == "yours") || (obj.toLowerCase() == "your")) {
            belief.subject = "self";
            aboutSelf.push(belief);
        } else {
            general.push(belief);
        }
        
        recentBelief = belief;
        return belief;

        //TO DO -> PUT IN THE CATEGORY FINDING
        //find similar belief in category
            //and increment magnitude
        //otherwise add the belief to category
    }

    this.update = function(obj){
        recentBelief = undefined;
        that.newBelief(obj);
    }

    this.getAppraisalVariables = function(){
        var modification = [];

        //did i learn something about myself
        if(recentBelief.subject == "self"){
            var mod0 = {};
            mod0.id = "surprise";
            mod0.val = 0.6;
            mod0.rep = "Learned something about myself."

            modification.push(mod0);

            var mod1 = {};
            //was is good
            if(recentBelief.sentiment > 0.05){
                mod1.id = "happiness";
                mod1.val = 1 * recentBelief.sentiment;
                mod1.rep = "Learned that I " + recentBelief.verb + " " + recentBelief.assertion + ".";

                modification.push(mod1);
            } else if(recentBelief.sentiment < -0.05){ //or bad
                mod1.id = "sadness"
                mod1.val = -1 * recentBelief.sentiment;
                mod1.rep = "Learned that I " + recentBelief.verb + " " + recentBelief.assertion + ".";
            }
            if(mod1.id) modification.push(mod1)
        //did i learn something about the other     
        } else if(recentBelief.subject == "other") { 
            var mod0 = {};
            mod0.id = "surprise";
            mod0.val = 0.3;
            mod0.rep = "Learned something about you."

            modification.push(mod0);

            //good
            if(recentBelief.sentiment > 0.05){
                var mod1 = {};
                mod1.id = "happiness";
                mod1.val = 0.7 * recentBelief.sentiment;
                mod1.rep = "Learned that you " + recentBelief.verb + " " + recentBelief.assertion + ".";

                modification.push(mod1)
            } else if(recentBelief.sentiment < -0.05) { //or bad
                var mod1 = {};
                mod1.id = "fear";
                mod1.val = -0.7 * recentBelief.sentiment;
                mod1.rep = "Learned that you " + recentBelief.verb + " " + recentBelief.assertion + ".";

                modification.push(mod1)
            }
        //did i learn new general knowlegde
        } else if (recentBelief.subject) {
            var mod0 = {};
            mod0.id = "surprise";
            mod0.val = 0.7;
            mod0.rep = "Learned that " + recentBelief.subject + " " + recentBelief.verb + " " + recentBelief.assertion + ".";

            modification.push(mod0);
        }

        return modification
    }

    this.getBeliefs = function(){
        return {aboutSelf : aboutSelf, aboutOther : aboutOther, general : general}
    }

    this.getId = function(){
        return id
    }
}

function getSentiment(sentence){

    var negations = new RegExp("^(never|nothing|nowhere|noone|none|not|haven't|hasn't|hadn't|can't'|couldn't|shouldn't|won't|wouldn't|don't|doesn't|didn't|isn't|aren't|ain't)$");

    var pos_lex = new RegExp("^(❤️|no problem|ya!|happy|excited|joyful|delighted|good|pleased|content|satisfied|euphoric|joy|overjoyed|jubilant|high|glad|pleased|willing|ready|fortunate|lucky|favor|favorable|advantage|advantageous|fortunate|fortune|delight|opportune|convenient|appropriate|fulfilled|enthusiastic|pleasing|positive|propitious|auspicious|thank|promising|encouraging|affirmative|affirmation|agree|agreeing|approve|approving|encourage|encouraging|agree|agreeing|united|approve|accept|acceptance|coincide|harmony|harmonize|good|deal|concur|beautiful|attractive|pretty|good|looking|appealing|engaging|glamorous|ravishing|gorgeous|stunning|elegant|exquisite|artistic|magnificent|divine|foxy|sexy|cute|smang|dime|model|handsome|alluring|interest|interested|engaging|striking|fetching|dapper|enchanting|enticing|delightful|winning|photogenic|irresistible|ravishing|desirable|fair|cool|hot|trendy|hip|happening|nice|poised|serene|coolest|chic|sophisticated|interesting|alive|yaaaas|skilled|killed|clean|pristine|auspicious|ill|mature|calm|true|worth|valid|yes|yup|yep|yea|yeah|yah|love|yeses|yessssss|yesyesyes|ok|k|okay|ok!|kewl|good-crazy|rules|owns|ballin|beautiful)$"); 

    var neu_lex = new RegExp("^(crazy|wierd)$");     

    var neg_lex = new RegExp("^(bad|wrong|lazy|stupid|dumb|boring|dull|monotonous|repetitive|unimaginative|insipid|uninteresting|lifeless|dead|bland|flat|unreadable|banal|lackluster|stodgy|vapid|tiring|irksome|trying|frustrating|lose|losing|deadly|vanilla|plain|substandard|poor|inferior|second|rate|unsatisfactory|deficient|imperfect|defective|faulty|incompetent|inept|awful|terrible|appalling|atrocious|godawful|rotten|pathetic|useless|bum|lousey|hurtful|corrupt|reprobate|amoral|unethical|dishonest|dishonorable|dirty|insubordinate|undisciplined|dreadful|disgusting|stress|stressful|crowded|unpleasant|smelly|unfortunate|ugly|adverse|inappropriate|minor|severe|grave|dead|putrid|odd|moldy|sour|rotten|rancid|spoiled|rank|stinky|beefy|guilty|guilt|ashamed|contrite|sorry|regret|regretful|childish|immature|phony|bologna|worthless|fake|false|invalid|no|hell|no|bad-crazy|sucks)$");





    /*var score;
    var result = [];
    var factor = 1;   */

    //tokenize input text 
    function tokenizeInput(text){
        var score;
        var factor = 1;
        var factorsToIgnore = 0;
        var result = [];
        var _text = text.trim().split(" ");
        for (var i = 0; i < _text.length; i++) 
        {   
           score = 0.0;
            
        var msg = _text[i].replace("'", "");
            msg = _text[i].match(/\b\w+\b/g);
            msg = _text[i].toLowerCase();
        var res = msg.split(" ");

            for( var j = 0; j < res.length; j++)
            {
              if(res[j].match(negations))
              {
                if(typeof res[j] !== 'undefined') 
                    //text[i] = "!" + text[i];
                    factor *= -1;
                    factorsToIgnore += 1;
              }
              score = Sentiment(res[j],score);

            }
          score = score/res.length;
          score = score.toFixed(2);
          var total = result.push(score);
        }
       
       var sentiment = 0;

        for(var x = 0; x < result.length; x += 1){
            sentiment += parseInt(result[x]);
        }
        return (sentiment/(result.length - factorsToIgnore)) * factor;
     }
     
    function Sentiment(word,score)

    {
        //if word matches anything in postive/negative lexicons add +1 or -1 to score
        if(word !== 'undefined') 
        {
            if(word.match(pos_lex)) score++ ;
            if(word.match(neg_lex)) score-- ;
            else score = score + 0;
            //console.log(score);

            return score
        }
    }

    return tokenizeInput(sentence);
}