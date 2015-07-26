/* 
** Name: particles.js
** Purpose: simulate particles moving around and display on webpage 
** help from http://html5hub.com/build-a-javascript-particle-system/
*/


//main object
var canvas = document.getElementById('mycanvas');

//get bitmap version of canvas
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle ="rgb(200,0,0)";