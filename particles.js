/* 
** Name: particles.js
** Purpose: simulate particles moving around and display on webpage 
** help from http://html5hub.com/build-a-javascript-particle-system/
*/


//main object
var canvas = document.getElementById("canvas");

//get bitmap version of canvas
var ctx = canvas.getContext("2d");

//canvas.width = window.innerWidth;
//canvas.height = window.innerHeight;

//ctx.fillStyle ="rgb(200,0,0)";

ctx.strokeStyle = "blue";

var midW = window.innerWidth ;
var midH = window.innerHeight ;

var widthRect = 300;
var heightRect = 300;

midW = (midW/2)-(widthRect/2);
midH = (midH/2) - (heightRect/2);
//ctx.strokeRect(midW, midH, widthRect, heightRect)
ctx.strokeRect(10,10,200,200);

//loop function
function loop() {
	clear();
	update();
	draw();
	queue();
}

//clear function
function clear() {
	ctx.clearRect(0,0,canvas.width, canvas.height);
}

//update function
function update () {

}

//draw function
function draw () {

}

//queue function
function queue () {
	window.requestAnimationFrame(loop);
}

loop();

//Vector function
function Vector(x,y) {
	this.x = x || 0;
	this.y = y || 0;
}

// Add a vector to another
Vector.prototype.add = function(vector) {
  this.x += vector.x;
  this.y += vector.y;
}
 
// Gets the length of the vector
Vector.prototype.getMagnitude = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};
 
// Gets the angle accounting for the quadrant we're in
Vector.prototype.getAngle = function () {
  return Math.atan2(this.y,this.x);
};
 
// Allows us to get a new vector from angle and magnitude
Vector.fromAngle = function (angle, magnitude) {
  return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
};

//Particle function
function Particle(point, velocity, acceleration)
{
	this.position = point || new Vector(0,0);
	this.velocity = velocity || new Vector(0, 0);
  	this.acceleration = acceleration || new Vector(0, 0);
}

Particle.prototype.move = function() {
	// Add our current acceleration to our current velocity
    this.velocity.add(this.acceleration);
 
    // Add our current velocity to our position
    this.position.add(this.velocity);
};


//Emitter function
function Emitter(point, velocity, spread) {
  this.position = point; // Vector
  this.velocity = velocity; // Vector
  this.spread = spread || Math.PI / 32; // possible angles = velocity +/- spread
  this.drawColor = "#999"; // So we can tell them apart from Fields later
}

Emitter.prototype.emitParticle = function() {
  // Use an angle randomized over the spread so we have more of a "spray"
  var angle = this.velocity.getAngle() + this.spread - (Math.random() * this.spread * 2);
 
  // The magnitude of the emitter's velocity
  var magnitude = this.velocity.getMagnitude();
 
  // The emitter's position
  var position = new Vector(this.position.x, this.position.y);
 
  // New velocity based off of the calculated angle and magnitude
  var velocity = Vector.fromAngle(angle, magnitude);
 
  // return our new Particle!
  return new Particle(position,velocity);
};

var particles = [];
 
// Add one emitter located at `{ x : 100, y : 230}` from the origin (top left)
// that emits at a velocity of `2` shooting out from the right (angle `0`)
var emitters = [new Emitter(new Vector(100, 230), Vector.fromAngle(0, 2))];




