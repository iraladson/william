#William

##Resources
Brannon Message Object w/ ammendments: sentiment => emoapp, intent, subject/verb/object, stopWord-free

n-grams

Neural Net

##Interfaces
###User
`respondTo(input)`

`input` is a string supplied by user. Returns a string response.

-------
###Hidden

`createMessageObject(input)`

Converts `input` into Brannon's message object (`bmo`). I'm tweaking it to contain affect, intention, and other useful forms.
Event-based.

-----
######Data Analysis
----
`extractSyntaxData(bmo)`

With respect to the bmo.intent, store the pos-sequence. Increment occurance if already stored. 
------------

`extractKnowledgeData(bmo)`

For each word, update the co-occurence tables.

For each word, extract pos,string,sentiment,posBefore,posAfter,sub/v/obj,intent. 

Train neural net?

------------
######Determine Response
-----------

topics[] = array of current `TopicObjects`

  ```javascript
  function TopicObject(){
    this.str = "topicString"
    this.svo = "subject" || "object" //ueful??
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
      
    create new topic from associtations. look at verbs!! Knowledge db?
  }
  ```
--------------

responseMode = "ansrYN" || "ansrAlt" || "ansrOpen" || "imper" || "declar" || "questYN" || "questAlt || "questOpen" || "newWord
  
  ```javascript
    function getResponse(bmo){
      var intent = bmo.getIntent();
      
      //check for new vocabulary
        if so, return newWord
      
      if(intent == questX) return ansrX
      
      if(intent == ansrX) return random pick betwen declar, and questX

      return random pick between declar, questX, (and rare imper)
    }
  ```
---------------

`responseSentence` = [] Populated with `responseWords`
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

1. newWord : get unknownWord => divert to predesigned questions.
2. questX : get topics from questX
2. ansrX : get topic from answrX
3. declar : get topic that ranks highest in some f(age,intrest) <= possible personality trait
4. imper: f(age,intrest) <= how does agent respond to 'commands'? not the main factor, but an important one

--------

`formSyntax(responseMode)`

Return an array of pos sequence syntax that matches the responseMode from the syntax database.

`syntaxDB`

```
{
  mode : [{ [posSequence0] },
          { [posSequence1] } ... ]
}
```

--------------

`placeTopicWords`

Place the chosen topic word in the syntax array in the position specified by pos and svo.

--------------

`populateSyntax`

For each position in each syntax condidate run neuralnet with features:

1. probablitiy that the word appears with the topicWord
2. probability that the word appears with the sentiment (plesantness / activation)
3. probability that the word appears with the responseMode
4. probability that the word appears near the nearby pos

The word that get the highest probability output is inserted into the `word` property of the `ResponseWord` in question. The probability is stored in the `neurProb` property.

Probabilities are determined by coccurance tables (word vs word), (word vs responseType), (word vs sentiment)

--------------

`selectBestSentence()`

Return the highest ranked sentence of f(neurProb*,syntaxProb), then some f() to parse out the words to make the string.


##Challenges

1. Storage.
2. Node. Hosting?
3. collaboration, integration. github?
4. efficiency?? simulate thinking??


bmo.posSequence
bmo.intent.best
bmo.stripped (dataextract.update)
