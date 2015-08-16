//Get the good ol canvas element//
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//set canvas size//
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//get middle of canvas//
var midW = window.innerWidth ;
var midH = window.innerHeight ;

var emitterCounter = 0;

//Particle definition//
var maxParticles = 1,
    neutronSize = 5,
    emissionRate = 1,
    objectSize = 3; // drawSize of emitter/field

//define boundary properties (rectangle) //
var widthRect = 500;
var heightRect = 500;
ctx.strokeStyle = "blue";
ctx.linewidth ="5";

//get pts to construct rectanlge @ center of page //
midW = (midW/2)-(widthRect/2);
midH = (midH/2) - (heightRect/2);

//get rect info to define area atoms will be placed in //
var maxW = midW + widthRect;
var maxH = midH + heightRect;

//define material properties//
var materialWidth = 3;
//var atomHeight = 3;
var materialLocations = [];

//vector object//
function Vector(x,y) {
	this.x=x;
	this.y=y;
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

//Particle object//
function Particle(point, velocity, acceleration) {
  this.position = point || new Vector(0, 0);
  this.velocity = velocity || new Vector(0, 0);
  this.acceleration = acceleration || new Vector(0, 0);
}

function Emitter(point, velocity, spread) {
    this.position = point; // Vector
    this.velocity = velocity; // Vector
    this.spread = spread || Math.PI / 32; // possible angles = velocity +/- spread
    this.drawColor = "#999"; // So we can tell them apart from Fields later
}

Emitter.prototype.emitParticle = function () {
    // Use an angle randomized over the spread so we have more of a "spray"
    var angle = this.velocity.getAngle() + this.spread - (Math.random() * this.spread * 2);

    // The magnitude of the emitter's velocity
    var magnitude = this.velocity.getMagnitude();

    // The emitter's position
    var position = new Vector(this.position.x, this.position.y);

    // New velocity based off of the calculated angle and magnitude
    var velocity = Vector.fromAngle(angle, magnitude);

    emitterCounter++;

    // return our new Particle!
    return new Particle(position, velocity);
};


function addNewParticles() {
    // if we're at our max, stop emitting.
    if (particles.length > maxParticles) return;

    // for each emitter
    for (var i = 0; i < emitters.length; i++) {

        // emit [emissionRate] particles and store them in our particles array
        for (var j = 0; j < emissionRate; j++) {
            particles.push(emitters[i].emitParticle());
        }
    }
}

function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

function plotParticles(boundsX, boundsY) {
    // a new array to hold particles within our bounds
    var currentParticles = [];

    for (var i = 0; i < particles.length; i++) {
        var particle = particles[i];
        var pos = particle.position;

        pos.x=roundToTwo((pos.x *100)/100);
        pos.y=roundToTwo((pos.y *100)/100);
        
        //check if we are @ boundary, bounce off boundary 
        if (pos.x <= midW || pos.x >= boundsX || pos.y < midH || pos.y >= boundsY) {

            var currX = particle.velocity.x;
            var currY = particle.velocity.y;
            var currAngle = particle.velocity.getAngle();
            particle.bounce(currX,currY,currAngle);
        }
        else
        {
        	particle.move();
        }

        // Add this particle to the list of current particles
        currentParticles.push(particle);
    }

    // Update our global particles reference
    particles = currentParticles;
}

function drawParticles() {
    ctx.fillStyle = 'rgb(0,0,255)';
    for (var i = 0; i < particles.length; i++) {
        var position = particles[i].position;
        drawCircle(position.x,position.y,neutronSize);
    }
}

function emitterCircle(object) {
    ctx.fillStyle = object.drawColor;
    ctx.beginPath();
    ctx.arc(object.position.x, object.position.y, objectSize, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function drawCircle(x,y,atomWidth) {
            ctx.beginPath();
            ctx.arc(x, y, atomWidth, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
}

//fill rectangle with atoms//
function drawMaterial(midW,midH,widthRect,heightRect) {
		
	//create rectangle
	ctx.strokeRect(midW,midH,widthRect,heightRect);

	//create regularly spaced atoms//
	for(x=midW+10; x<maxW; x+=40)
	{
		for(y=midH+10; y<maxH; y+=40)
		{
            drawCircle(x,y,materialWidth);
			//add coordinates//
			materialLocations.push(new Vector(x,y));
		}
	}
}
//How to move the particle //
Particle.prototype.move = function () {

    //add acc to current velocity
    this.velocity.add(this.acceleration);

    //add current velocity to position
    this.position.add(this.velocity);

    //check for collisions//
    for(i=0; i<materialLocations.length; i++){
        var x1 = this.position.x;
        var y1 = this.position.y;
        var x2 = materialLocations[i].x;
        var y2 = materialLocations[i].y;
        collisionDetection(x1,y1,x2,y2);
    }
}

Particle.prototype.bounce = function (xVel,yVel,angle) {

    //var angle = xVel.getAngle();

    this.velocity  = new Vector(-(xVel),-(yVel));
    
    //add acc to current velocity
    this.velocity.add(this.acceleration);

    //add current velocity to position
    this.position.add(this.velocity);

}
function collisionDetection(x1,y1,x2,y2)
{
    var neutron = {radius: materialWidth , x: x1, y: y1};
    var material = {radius: neutronSize, x: x2, y: y2};

    var dx = neutron.x - material.x;
    var dy = neutron.y - material.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < neutron.radius + material.radius) {
        // collision detected!
            //document.write("chicken");
            var currX = this.particle.velocity.x;
            var currY = this.particle.velocity.y;
            var currAngle = particle.velocity.getAngle();
            bounce(currX,currY,currAngle);
    } 
}


var particles = [];

var midX = canvas.width / 2;
var midY = canvas.height / 2;

// Add one emitter located at `{ x : 100, y : 230}` from the origin (top left)
// that emits at a velocity of `2` shooting out from the right (angle `0`)
var emitters = [new Emitter(new Vector(midX - 150, midY), Vector.fromAngle(0, 2))];

// Add one field located at `{ x : 400, y : 230}` (to the right of our emitter)
// that repels with a force of `140`
//var fields = [new Field(new Vector(midX + 150, midY), -140)];


function loop() {
    clear();
    update();
    draw();
    queue();
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
    
    if(emitterCounter==0)
    {
       addNewParticles();
    }
       plotParticles(maxW, maxH);

}

function draw() {
    drawParticles();
	drawMaterial(midW,midH,widthRect,heightRect)
    emitters.forEach(emitterCircle);   
}

function queue() {
    window.requestAnimationFrame(loop);
}

loop();

