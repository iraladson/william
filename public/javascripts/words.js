Object.defineProperty(Array.prototype, "remove", {
    enumerable: false,
    value: function (item) {
        var removeCounter = 0;

        for (var index = 0; index < this.length; index++) {
            if (this[index] === item) {
                this.splice(index, 1);
                removeCounter++;
                index--;
            }
        }

        return removeCounter;
    }
});
var words = ["no problem","ya!","happy","excited","joyful","delighted","good","pleased","content","satisfied","euphoric","joy","overjoyed","jubilant","high","glad","pleased","willing","ready","fortunate","lucky","favor","favorable","advantage","advantageous","fortunate","fortune","delight","opportune","convenient","appropriate","fulfilled","enthusiastic","pleasing","positive","propitious","auspicious","thank","promising","encouraging","affirmative","affirmation","agree","agreeing","approve","approving","encourage","encouraging","agree","agreeing","united","approve","accept","acceptance","coincide","harmony","harmonize","good","deal","concur","beautiful","attractive","pretty","good","looking","appealing","engaging","glamorous","ravishing","gorgeous","stunning","elegant","exquisite","artistic","magnificent","divine","foxy","sexy","cute","smang","dime","model","handsome","alluring","interest","interested","engaging","striking","fetching","dapper","enchanting","enticing","delightful","winning","photogenic","irresistible","ravishing","desirable","fair","cool","hot","trendy","hip","happening","poised","serene","coolest","chic","sophisticated","interesting","alive","yaaaas","skilled","killed","clean","pristine","auspicious","ill","mature","calm","true","worth","valid","yes","yup","yep","yea","yeah","yah","yeses","yessssss","yesyesyes","ok","k","okay","ok","kewl","good-crazy","rules","owns","ballinbad","wrong","lazy","stupid","dumb","boring","dull","monotonous","repetitive","unimaginative","insipid","uninteresting","lifeless","dead","bland","flat","unreadable","banal","lackluster","stodgy","vapid","tiring","irksome","trying","frustrating","lose","losing","deadly","vanilla","plain","substandard","poor","inferior","second","rate","unsatisfactory","deficient","imperfect","defective","faulty","incompetent","inept","awful","terrible","appalling","atrocious","godawful","rotten","pathetic","useless","bum","lousey","hurtful","corrupt","reprobate","amoral","unethical","dishonest","dishonorable","dirty","insubordinate","undisciplined","dreadful","disgusting","stress","stressful","crowded","unpleasant","smelly","unfortunate","adverse","inappropriate","minor","severe","grave","dead","putrid","odd","moldy","sour","rotten","rancid","spoiled","rank","stinky","beefy","guilty","guilt","ashamed","contrite","sorry","regret","regretful","childish","immature","phony","bologna","worthless","fake","false","invalid","no","hell","no","bad","crazy","sucks"];
