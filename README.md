#William

##Resources
Brannon Message Object

  Ammendments: sentiment => emoapp, intent, subject/verb/object, stopWord-free

N-Grams. 

Neural Net

##Interfaces
###User
`respondTo(input)`

`input` is a string supplied by user. Returns a string response.

-------
###Hidden

`createMessageObject(input)`

usage: in respondTo

Converts `input` into Brannon's message object (`bmo`). I'm tweaking it to contain affect, intention, and other useful forms.
Event-based.

-----
######Data Analysis
----
`extractSyntaxData(bmo)`

Extracts useful n-grams from `bmo.string`.

High-level Description
1. Extract part-of-speech n-grams for the sentence, subject, object, pos-verbWord-pos
2. Classify with sentiment and intent
3. Store, then return n-gram. Json? SQL 4 Server? Write to disk?

Notes for Probability

```
count(start,[opt: next...]) = counts occurrence of specified sequence
*# of params decide n-gram n

getProb(feature,[start,feature]) = count(ng-1, ng) / count(ng)
*The second parameter is the sequence that must be matched. Different for various n-grams.
*Must be stored as log

```

------------

`extractKnowledgeData(bmo)`

Extracts useful word info. For each word, extract pos,string,sentiment,posBefore,posAfter,sub/v/obj,intent.
2. Store new word in appropriate database (categorized by pos and sub/v/obj)
3. Train neural net (on server?) w/ word info

Words are classified by pos and sub/obj/verb

Nueral Nets Training
Inputs[sentiment,posBefore,posAfter,intent] Last three are going to be formed as boolean statements
Output[p(w1), p(w2)...p(wn)] where p(x) is the probability of x between 0-1, and w is a word belonging to the current

Concerns: Will learning new words throw off the weights/biases of the net? Activation?

------------
######Determine Response
-----------

topics[] = array of current topicObjects

  ```javascript
  function TopicObject(){
    this.str = "topicString"
    this.svo = "subject" || "object" || other || self
    this.age = increment every turn
    this.pos = "pos"
    this.interest = f(bmo.isdesire() + magnitude) determines interest
    this.isDead = f() determines if topic has expired. function of age and intrest
  }
  
  function updateTopics(bmo){
    for every i, topics[i].age++
    kill old topics with .isDead()
    
    if bmo.getIntent() == intentX
      create new TopicObject(bmo.stuff,intentX)
      
    create new topic from associtations. look at verbs!!
  }
  ```
--------------

responseMode = "ansrYN" || "ansrAlt" || "ansrOpen" || "imper" || "declar" || "questYN" || "questAlt || "questOpen"
  
  ```javascript
    function getResponse(bmo){
      var intent = bmo.getIntent();
      
      if(intent == questX) return ansrX
      
      if(intent == ansrX) return random pick betwen imper, declar, and questX

      return random pick between declar, questX, (and rare imper)
    }
  ```
---------------

responseSentence = [] Populated with `responseWords`
```javascript
  function ResponseWords(pos){
    this.word = "" //placeTopicWords & populateSyntax
    this.pos = pos
    this.neurProb = 0 // populateSyntax
    
  }
```
--------

`grabCoreIdeas(topics,responseMode)`

switch(responseMode) logic.

1. questX : get topics from questX
2. ansrX : get topic from answrX
3. declar : get topic that ranks highest in some f(age,intrest) <= possible personality trait
4. imper: f(age,intrest) <= how does agent respond to 'commands'? not the main factor, but an important one

--------

`formSyntax(responseMode,bmo)`

From the database, get all subject, verb, and object n-gram probabilities (or log(p)) that match the quadrant of the current mood.
From db, get all the s-v-o p(n-gram) that match the responseMode.

Find and return all the syntax-es(?) that are close in distance in both set of n-grams???? If not, find the n-grams sequences with the highest probabilities that contain the pos of a topic

//SOMETHING ON VERB SELECTION


--------------

`placeTopicWords`

Put topic words in the syntax array in the position specified by pos and svo.

--------------

`populateSyntax`

For each position in each syntax condidate run neural net with inputs:

1. posXbefore i.e. {"N" : 0} , {"V" : 1} ...
2. posXafter
3. mood.pleasantness
4. mood.activation
5. responseMode i.e {"ansrX" : 1 } ...
6. ?????word????? too much...too slow

The net outputs `word`. `word`s are categorized by pos and subject, verb, object. relations are trained on a neural net. Store the probability of the word prediction in `responseWord`.

--------------

`selectBestSentence()`

Return the highest ranked sentence of f(neurProb*,syntaxProb), then some f() to parse out the words to make the string.


##Challenges

1. Storage.
2. Node. Hosting?
3. collaboration, integration. github?
4. efficiency?? simulate thinking??

