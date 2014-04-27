
    function Agent(vec){ 

    var x = Math.random()*canvas.width;
    var y = Math.random()*canvas.height;
    
    this.vec = {x : vec[0], y : vec[1]};
    
    var age = 10 + this.vec.y;
    var mass = 20 + this.vec.x * 100;

    var color;
    if(vec.x > 0)color='green';
    if(vec.x<0)color='blue';
  
    //this.func => can be called out side of obj
    this.display = function(){
    ctx.fillStyle = color;  
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2, false);
    ctx.fill();
    }
    this.move = function(){}
    this.label = function(word){}

    //this.p = physics.makeParticle(mass, x,y);
    //particles.push(this);
    var p = physics.makeParticle(mass, x,y);
    particles.push(p);
  }
// the agent
   function Particle(){ 

    var x = Math.random()*canvas.width;
    var y = Math.random()*canvas.height;

    this.stuff = "hey";
    
    var age = 50;
    var mass = 5;
    var color = 'red';
    
    this.display = function(){
    ctx.fillStyle = color;  
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2, false);
    ctx.fill();
    }
    this.move = function(){}

    //this.p = physics.makeParticle(mass, x,y);
    //particles.push(this);
    var p = physics.makeParticle(mass, x,y);
    particles.push(p);

  }

/*/
  var particles = [];
  var gravity = 0.001;
  var drag = 0.1;
  var physics = new Physics(gravity,drag);

  var particlesize = [];
  var strength = 2000;
  var minDistance = canvas.width;
 
 //adding agent
  
  //console.log(agent.getX());
 
 //adding particles 
  var particle = new Particle();
  var particle2 = new Particle();
  var particle3 = new Particle();
  
  for(var i = 0; i < particles.length -1; i++){
    console.log(particles[0]);
    var attraction = physics.makeAttraction(particles[0],particles[i+1], strength, minDistance);
 }
  
*/
  var render = function() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
      var p = particles[0];
      var position = p.position;
     ctx.fillStyle = '#333';
      ctx.beginPath();
      ctx.arc(position.x, position.y, p.mass, 0, Math.PI * 2, false);
      ctx.fill();

   for (var i =1; i < particles.length; i++){
       // var p = particles[i];

      var p2 = particles[i];
      var position_ = p2.position;
      //ctx.fillStyle = 'black';
      ctx.rect(position_.x, position_.y, p2.mass, p2.mass);
      ctx.fill();
     }


  };
    