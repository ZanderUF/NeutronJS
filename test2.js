"use strict";

var maxParticles = 1,
    particleSize = 1,
    emissionRate = 1,
    objectSize = 3; // drawSize of emitter/field


//TEST 
var emitterCounter = 0;

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


function Particle(point, velocity, acceleration) {
    this.position = point || new Vector(0, 0);
    this.velocity = velocity || new Vector(0, 0);
    this.acceleration = acceleration || new Vector(0, 0);
}


Particle.prototype.move = function () {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
};


function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Vector.prototype.add = function (vector) {
    this.x += vector.x;
    this.y += vector.y;
}

Vector.prototype.getMagnitude = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.getAngle = function () {
    return Math.atan2(this.y, this.x);
};

Vector.fromAngle = function (angle, magnitude) {
    return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
};

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
       plotParticles(canvas.width, canvas.height);

}

function draw() {
    drawParticles();

    emitters.forEach(drawCircle);   
}

function queue() {
    window.requestAnimationFrame(loop);
}

loop();