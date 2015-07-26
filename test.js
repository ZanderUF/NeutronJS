var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var midW = window.innerWidth ;
var midH = window.innerHeight ;

//define boundary properties (rectangle) //
var widthRect = 500;
var heightRect = 500;
ctx.strokeStyle = "blue";

//get pts to construct rectanlge @ center of page //
midW = (midW/2)-(widthRect/2);
midH = (midH/2) - (heightRect/2);

//define material properties//
var atomWidth = 3;
var atomHeight = 3;

function init() {

	window.requestAnimationFrame(drawMaterial);
}

//fill rectangle with atoms
function drawMaterial(midW,midH,widthRect,heightRect,atomWidth,atomHeight) {
	ctx.clearRect(midW,midH,widthRect,heightRect);

	//create rectangle
	ctx.strokeRect(midW,midH,widthRect,heightRect);

	//get rect info to define area atoms will be placed in //
	var maxW = midW + widthRect;
	var maxH = midH + heightRect;

	// # of atoms inside rectangle //
	var n =20
	for(i=0; i<n; i++) {
		//randomly distribute atoms within box//
		var randX = Math.floor((Math.random() * widthRect-atomWidth) + midW);
		var randY = Math.floor((Math.random() * heightRect-atomHeight) + midH);

		ctx.fillRect(randX,randY,atomWidth,atomHeight);
	}
	ctx.save;

	window.requestAnimationFrame(drawMaterial);
}

drawMaterial(midW,midH,widthRect,heightRect,atomWidth,atomHeight);

init();
