#William

##Features

##Resources

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
____
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

Extracts useful word info

High-Level Description
1. For each word, extract info (pos,string,sentiment,pos<<,pos>>,sub/v/obj,intent)
2. Store new word in appropriate database (defined by pos and sub/v/obj)
3. Train nn on server w/ word info

Words are classified by pos and sub/obj/verb

Nueral Nets Training
Inputs[sentiment,posBefore,posAfter,intent] Last three are going to be formed as boolean statements
Output[p(w1), p(w2)...p(wn)] where p(x) is the probability of x between 0-1, and w is a word belonging to the current

Concerns: Will learning new words throw off the weights/biases of the net? Activation?

------------
######Determine Response
------------

`selectVerb(response,bmo)`

-------------
`createSyntax(response,bmo)`

High-Level Description
1. Get highest probability pos n-grams from classifier based on mood and intent.
--------------

`populateWithWords(response,bmo)`
