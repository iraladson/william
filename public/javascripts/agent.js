var canvas = $("#William")[0];
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight; 
var Width = canvas.width;
var Height = canvas.height;

var strength = 100;
var minDistance = 20;
var physics = new Physics();
//var physics = new Physics();  
var space = [];

var setlength = function(l){
  for(var i =0; i < physics.springs.length; i++){
    physics.springs[i].length = l;
  }
}

var Makeattrac = function(a,b){
      var strength = -300;
      var mindist = 5;
      var attraction = physics.makeAttraction(a,b,strength,mindist);
    }
var Makespring = function(a,b){     
  var strength = 1; // What is the strength of the bond?
  var drag = 0.1; // How much drag is on the string?
  var rest = 30; // What is the rest length of the spring?
  var spring = physics.makeSpring(a, b, strength, drag, rest);   
}

var coreDisplay = function(a){ 
  x=a.position.x;
  y=a.position.y;

  ctx.restore();
  ctx.fillStyle = 'rgba(0,0,0,0.5)';  
  ctx.beginPath();
  ctx.arc(x, y, 15 , 0, Math.PI * 2, false);
  ctx.fill();
  
  ctx.save();
  ctx.fillStyle = 'red';  
  ctx.beginPath();
  ctx.arc(x, y, 5 , 0, Math.PI * 2, false);
  ctx.fill();
  
}

var drawSpring = function(){
  if(physics.springs!=0){
    for(var i =0; i < physics.springs.length; i++){
      var from =physics.springs[i].a.position;
      var to =  physics.springs[i].b.position;
      
      ctx.strokeStyle = 'red';
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  }
}

//////// OBJ //////////
function Core(x,y){
    
    
    var mass = 1;
    this.x = x;
    this.y = y;

    var root = physics.makeParticle(mass, this.x,this.y);

    //root.position.x = this.x;
    //root.position.y = this.x;

    this.children = [];
    this.color = getRandomColor();
    var rad = 10;
    this.text="";
    this.self=function(){return root;}
    
    this.makechild = function(id){
      var newChild = 
      physics.makeParticle(0.8, this.x+Math.random() * 50 - 25,this.y+Math.random() * 50 - 25);
      this.children.push(newChild);
      this.id = id;
//@@@@@
      if(this.children.length != 0){
        for(var i=0; i<this.children.length; i++){
          var a = this.children[i];
          //var b = this.children[i+1];
          if(newChild !=a)
         Makeattrac(newChild,a);
        }
      }
      Makespring(root,newChild);
      return newChild;
    }
   this.makesubchild = function(parent){
      root = parent;
      var newChild = 
      physics.makeParticle(0.8, this.x+Math.random() * 50 - 25,this.y+Math.random() * 50 - 25);
      this.children.push(newChild);
//@@@@@
      if(this.children.length != 0){
        for(var i=0; i<this.children.length; i++){
          var a = this.children[i];
          //var b = this.children[i+1];
          if(newChild !=a)
         Makeattrac(newChild,a);
        }
      }
      Makespring(root,newChild);
      return newChild;
    }
}
    

function Agent(){ 

    var startX = Width/2;
    var startY = Height/2;
   //
    var age = 0;
    var mass = 1;
    var p = physics.makeParticle(mass, startX,startY);
    var x,y,xVel,yVel;
    var xxx = 0,yyy =0;
    x = p.position.x;
    y = p.position.y;
    xVel =p.velocity.x;
    yVel =p.velocity.y;

    this.nearby = [];
  //
    this.color = getRandomColor();
    this.color_agent = 'rgba(0,0,0,0.5)';
    this.rad = 40;
    this.text="";
    var xAccel=0;
    var yAccel=0;  
    var accelValue = 0.5;

    this.setVector = function(a,b){
      xxx=a;
      yyy=b;
      if(a >= 3){
        this.color_agent='red';
        this.text = "I'm Angry";

      }
      if(a <= 2){
        this.color_agent='rgba(0,0,0,0.5)';
        this.text = "I'm Okay";
      }
      if(a < 1){
        this.color_agent='rgba(0,0,0,0.5)';
        this.text = "I'm dying..";
            this.addrad = -0.1;

      }

    }
    this.getX = function(){return p.position.x;}
    this.getY = function(){return p.position.y;}
    this.self = function(){return p;}
    this.dist = function(a) {return p.position.distanceTo(a.position);}  

    this.label = function(text){
      
      if(text == undefined)text="Talk to Me";
      ctx.font = '15pt Arial';
      var metrics = ctx.measureText(text);
      var textwidth = metrics.width;
      ctx.beginPath();
      ctx.rect(x+this.rad-5,y-this.rad-18, textwidth+10, 25);
      ctx.fillStyle = 'red';
      ctx.fill();
      
      ctx.textAlign="left"; 

      ctx.fillStyle = 'white';  
      ctx.fillText(text,x+2+this.rad,y-this.rad);
    }

    this.display = function(){
      x = p.position.x;
      y = p.position.y;
      ctx.fillStyle = this.color_agent;  
      ctx.beginPath();
      ctx.arc(x, y, this.rad, 0, Math.PI * 2, false);
      ctx.fill();
      
      //area
      ctx.beginPath();
      ctx.lineWidth = 12;
      ctx.strokeStyle=vectorColor(vex2col);
      ctx.arc(x,y,this.rad+20,0,2*Math.PI);
      ctx.stroke();
    }
 
    this.move = function(){ 
        
      xAccel = (Math.random() * 2 - 1)*0.5;

      if(xAccel != 0){
        xAccel *= 1+xxx/(1 + Math.abs(startX - x));
        if((startX-x < 0 && xAccel > 0) || (startX-x > 0 && xAccel < 0))
        {
          xAccel *= -1-xxx;
        }
      }
      
      yAccel = (Math.random() * 2 - 1)*0.5;

      if(yAccel != 0){
        yAccel *= 1+yyy/(1 + Math.abs(startY - y));
        if((startY-y < 0 && yAccel > 0) || (startY-y > 0 && yAccel < 0))
        {
          yAccel *= -1-yyy;
        }
      }

      xVel += xAccel;
      yVel += yAccel;
      
      x += xVel;
      y += yVel;
      if(x>Width)x=0;
      if(x<0)x=Width;
      if(y>Height)y=0;
      if(y<0)y=Height;
      p.position.set(x,y);
      p.velocity.set(xVel,yVel);
    }
    
  }
//@other
function Other(id,txt){ 
    //var id;
    //var txt;
    var startX = Math.random()*canvas.width;
    var startY = Math.random()*canvas.height;
    var x,y,xVel,yVel;
    //this.nearA = false;
   //
    var age = Math.random()*200;
    var mass = 10;
    var p = physics.makeParticle(mass, startX,startY);
    var x,y,xVel,yVel;
    x = p.position.x;
    y = p.position.y;
    xVel =p.velocity.x;
    yVel =p.velocity.y;   

  //
    var color = getRandomColor();
    var rad = 5; 
    var xAccel=0;
    var yAccel=0;
    var accelValue = 0.5;

    this.getX = function(){return p.position.x;}
    this.getY = function(){return p.position.y;}
    this.self = function(){return p;}
    this.dist = function(a) {return p.position.distanceTo(a.position);}  

//@Todo
    this.closeToAgent = function(agent){
      
        if(this.nearA){
          //physics.particels.remove(this.p);
          agent.nearby[id] = txt;
          //console.log(agent.nearby);
        }
             
        if(!this.nearA){
          agent.nearby.remove(txt);
        } 
        //agent.nearby.remove(undefined); 
     
    }
    this.label = function(){
     
     ctx.font = '8pt Arial';
     ctx.textAlign="center"; 

      var metrics = ctx.measureText(txt);
      var textwidth = metrics.width;
      
      ctx.beginPath();
      ctx.rect(x-textwidth/2-2,y-rad-14, textwidth+3, 12);
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.7)';  
      ctx.fillText(txt,x,y-10);
    }

    this.display = function(){
      x = p.position.x;
      y = p.position.y;
      
      //hide when it's dead
      if(!p.dead) {
      ctx.fillStyle = color;  
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2, false);
      ctx.fill();
      }
      //aging
      if(p.age>300)p.dead=true;
      if(p.dead){
        space.remove(this);

        physics.particles.remove(p);
        
        // var index = physics.particles.indexOf(p);
        // if (index > -1) {
        //     physics.particles.splice(index, 1);
        // }
//working!!
      //   for(var i = physics.particles.length-1; i--;){
      //     if (physics.particles[i] === p) physics.particles.splice(i, 1);
      //   }
       }
      //console.log(physics.particles.length);

    }

    this.move = function(){ 
   
      xAccel = (Math.random() * 2 - 1)/5;
      if(xAccel != 0){
        xAccel *= 1/(1 + Math.abs(startX - x));
        if((startX-x < 0 && xAccel > 0) || (startX-x > 0 && xAccel < 0))
        {
          xAccel *= -1;
        }
      }
      
      yAccel = (Math.random() * 2 - 1)/5;
      if(yAccel != 0){
        yAccel *= 1/(1 + Math.abs(startY - y));
        if((startY-y < 0 && yAccel > 0) || (startY-y > 0 && yAccel < 0))
        {
          yAccel *= -1;
        }
      }

      xVel += xAccel;
      yVel += yAccel;
      
      x += xVel;
      y += yVel;

      if(x>Width)x=0;
      if(x<0)x=Width;
      if(y>Height)y=0;
      if(y<0)y=Height;

      p.position.set(x,y);
      p.velocity.set(xVel,yVel);
   }
  }
