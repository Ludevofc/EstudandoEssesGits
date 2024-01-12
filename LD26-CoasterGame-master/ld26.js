function ld26game(canvas) {

	var mouseDown = false;
	var mouseClicked = false;
	var mouseX = 0;
	var mouseY = 0;
	var loading = false

	canvas.onmousedown = mousedown;
	canvas.onmouseup = mouseup;
	canvas.onmousemove = getMousePosition;

	function mousedown(evt) {
		mouseDown = true;
		mouseClicked = true;
	}

	function mouseup(evt) {
		mouseDown = false;
	}

	function getMousePosition(evt) {

	el = canvas
	var _x = 0;
	var _y = 0;

	while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
		_x += el.offsetLeft;
 		_y += el.offsetTop;
        el = el.offsetParent;
    }

		mouseX = (evt.pageX - _x);
		mouseY = (evt.pageY - _y);
	}


	//Track Piece Functions
	//d is distance across track piece, d is variable for non straight pieces.
	var trackpieces = [{ //Straight Track Piece facing x direction
		offsets: function(d) {
			var off = {
				x: 0,
				y: 0,
				z: 0
			}
			off.x = d
			off.y = 0.5
			off.z = 1 / 6
			return off;
		},
		span: 1,
		finalo: {
			x: 1,
			y: 0,
			z: 0
		},
		rotchange: 0,
		size: {x:1,y:1,z:1},
		slope: 3
	},

	{ //turn right 2x2 x to y
		offsets: function(d) {
			var off = {
				x: 0,
				y: 0,
				z: 0
			}
			off.x = Math.sin((d / 2.355) * (Math.PI / 2)) * 1.5;
			off.y = 2 - Math.cos((d / 2.355) * (Math.PI / 2)) * 1.5;
			off.z = 1 / 6;
			return off;
		},
		span: 2.355,
		finalo: {
			x: 2,
			y: 2,
			z: 0
		},
		rotchange: 1,
		size: {x:2,y:2,z:1},
		slope: 3
	},

	{ //turn left 2x2 x to y
		offsets: function(d) {
			var off = {
				x: 0,
				y: 0,
				z: 0
			}
			off.x = Math.sin((d / 2.355) * (Math.PI / 2)) * 1.5;
			off.y = -1 + Math.cos((d / 2.355) * (Math.PI / 2)) * 1.5;
			off.z = 1 / 6;
			return off;
		},
		span: 2.355,
		finalo: {
			x: 1,
			y: -1,
			z: 0
		},
		rotchange: -1,
		size: {x:2,y:0,z:1},
		slope: 3
	},

	{ //turn right 3x3 x to y
		offsets: function(d) {
			var off = {
				x: 0,
				y: 0,
				z: 0
			}
			off.x = Math.sin((d / 3.93) * (Math.PI / 2)) * 2.5;
			off.y = 3 - Math.cos((d / 3.93) * (Math.PI / 2)) * 2.5;
			off.z = 1 / 6;
			return off;
		},
		span: 3.93,
		finalo: {
			x: 3,
			y: 3,
			z: 0
		},
		rotchange: 1,
		size: {x:3,y:3,z:1},
		slope: 3
	},

	{ //turn left 3x3 x to y
		offsets: function(d) {
			var off = {
				x: 0,
				y: 0,
				z: 0
			}
			off.x = Math.sin((d / 3.93) * (Math.PI / 2)) * 2.5;
			off.y = -2 + Math.cos((d / 3.93) * (Math.PI / 2)) * 2.5;
			off.z = 1 / 6;
			return off;
		},
		span: 3.93,
		finalo: {
			x: 2,
			y: -2,
			z: 0
		},
		rotchange: -1,
		size: {x:3,y:0,z:1},
		slope: 3
	},

	{ //str -> sloped Track Piece facing x direction
		offsets: function(d) {
			var off = {
				x: 0,
				y: 0,
				z: 0
			}
			off.x = d
			off.y = 0.5
			off.z = 1 / 6 + (4.2 - Math.cos(d * 0.9332) * 4.2) / 10
			return off;
		},
		span: 1,
		finalo: {
			x: 1,
			y: 0,
			z: 1 / 3
		},
		rotchange: 0,
		size: {x:1,y:1,z:1},
		slope: 4
	}, { //sloped Track Piece facing x direction
		offsets: function(d) {
			var off = {
				x: 0,
				y: 0,
				z: 0
			}
			off.x = (d / 1.054)
			off.y = 0.5
			off.z = (d / 1.054) / 3
			return off;
		},
		span: 1.054,
		finalo: {
			x: 1,
			y: 0,
			z: 1 / 3
		},
		rotchange: 0,
		size: {x:1,y:1,z:1},
		slope: 4
	}, { //sloped -> str Track Piece facing x direction
		offsets: function(d) {
			var off = {
				x: 0,
				y: 0,
				z: 0
			}
			off.x = d
			off.y = 0.5
			off.z = 1 / 6 + (-4.2 + Math.cos(0.9332 - d * 0.9332) * 4.2) / 10
			return off;
		},
		span: 1,
		finalo: {
			x: 1,
			y: 0,
			z: 0
		},
		rotchange: 0,
		size: {x:2,y:2,z:2},
		slope: 3
	},

	{ //sloped turn right 2x2
		offsets: function(d) {
			var off = {
				x: 0,
				y: 0,
				z: 0
			}
			off.x = Math.sin((d / 3.16) * (Math.PI / 2)) * 1.5;
			off.y = 2 - Math.cos((d / 3.16) * (Math.PI / 2)) * 1.5;
			off.z = (d * 2 / 3.16) / 3
			return off;
		},
		span: 3.16,
		finalo: {
			x: 2,
			y: 2,
			z: 2 / 3
		},
		rotchange: 1,
		size: {x:2,y:2,z:2},
		slope: 4
	},

	{ //sloped turn left 2x2
		offsets: function(d) {
			var off = {
				x: 0,
				y: 0,
				z: 0
			}
			off.x = Math.sin((d / 3.16) * (Math.PI / 2)) * 1.5;
			off.y = -1 + Math.cos((d / 3.16) * (Math.PI / 2)) * 1.5;
			off.z = (d * 2 / 3.16) / 3
			return off;
		},
		span: 3.16,
		finalo: {
			x: 1,
			y: -1,
			z: 2 / 3
		},
		rotchange: -1,
		size: {x:2,y:0,z:2},
		slope: 4
	},

	{ //str -> slopedown Track Piece facing x direction
		offsets: function(d) {
			var off = {
				x: 0,
				y: 0,
				z: 0
			}
			off.x = d
			off.y = 0.5
			off.z = 1 / 6 + (-4.2 + Math.cos(d * 0.9332) * 4.2) / 10
			return off;
		},
		span: 1,
		finalo: {
			x: 1,
			y: 0,
			z: -1 / 3
		},
		rotchange: 0,
		size: {x:1,y:1,z:1},
		slope: 2
	},

	{ //slopedown Track Piece facing x direction
		offsets: function(d) {
			var off = {
				x: 0,
				y: 0,
				z: 0
			}
			off.x = (d / 1.054)
			off.y = 0.5
			off.z = (1 - d / 1.054) / 3
			return off;
		},
		span: 1.054,
		finalo: {
			x: 1,
			y: 0,
			z: -1 / 3
		},
		rotchange: 0,
		size: {x:1,y:1,z:1},
		slope: 2
	},

	{ //slopedown -> str Track Piece facing x direction
		offsets: function(d) {
			var off = {
				x: 0,
				y: 0,
				z: 0
			}
			off.x = d
			off.y = 0.5
			off.z = 1 / 6 + (4.2 - Math.cos(0.9332 - d * 0.9332) * 4.2) / 10
			return off;
		},
		span: 1,
		finalo: {
			x: 1,
			y: 0,
			z: 0
		},
		rotchange: 0,
		size: {x:1,y:1,z:1},
		slope: 3
	},

	{ //slopedown turn right 2x2
		offsets: function(d) {
			var off = {
				x: 0,
				y: 0,
				z: 0
			}
			off.x = Math.sin((d / 3.16) * (Math.PI / 2)) * 1.5;
			off.y = 2 - Math.cos((d / 3.16) * (Math.PI / 2)) * 1.5;
			off.z = (1 - d * 2 / 3.16) / 3
			return off;
		},
		span: 3.16,
		finalo: {
			x: 2,
			y: 2,
			z: -2 / 3
		},
		rotchange: 1,
		size: {x:2,y:2,z:0},
		slope: 2
	},

	{ //slopedown turn left 2x2
		offsets: function(d) {
			var off = {
				x: 0,
				y: 0,
				z: 0
			}
			off.x = Math.sin((d / 3.16) * (Math.PI / 2)) * 1.5;
			off.y = -1 + Math.cos((d / 3.16) * (Math.PI / 2)) * 1.5;
			off.z = (1 - d * 2 / 3.16) / 3
			return off;
		},
		span: 3.16,
		finalo: {
			x: 1,
			y: -1,
			z: -2 / 3
		},
		rotchange: -1,
		size: {x:2,y:0,z:0},
		slope: 2
	},

	{ //str -> supersloped Track Piece facing x direction
		offsets: function(d) {
			var off = {
				x: 0,
				y: 0,
				z: 0
			}
			off.x = d
			off.y = 0.5
			off.z = 1 / 6 + (4.2 - Math.cos(d * 0.9332) * 4.2) / 3.25
			return off;
		},
		span: 1,
		finalo: {
			x: 1,
			y: 0,
			z: 2 / 3
		},
		rotchange: 0,
		size: {x:1,y:1,z:2},
		slope: 5
	}, { //supersloped Track Piece facing x direction
		offsets: function(d) {
			var off = {
				x: 0,
				y: 0,
				z: 0
			}
			off.x = (d / 1.5275)
			off.y = 0.5
			off.z = (d / 1.5275) * 4 / 3
			return off;
		},
		span: 1.5275,
		finalo: {
			x: 1,
			y: 0,
			z: 4 / 3
		},
		rotchange: 0,
		size: {x:1,y:1,z:4},
		slope: 5
	}, { //supersloped -> str Track Piece facing x direction
		offsets: function(d) {
			var off = {
				x: 0,
				y: 0,
				z: 0
			}
			off.x = d
			off.y = 0.5
			off.z = 3 / 6 + (-4.2 + Math.cos(0.9332 - d * 0.9332) * 4.2) / 3.25
			return off;
		},
		span: 1,
		finalo: {
			x: 1,
			y: 0,
			z: 1 / 3
		},
		rotchange: 0,
		size: {x:1,y:1,z:2},
		slope: 3
	},

	{ //str -> superslopedown Track Piece facing x direction
		offsets: function(d) {
			var off = {
				x: 0,
				y: 0,
				z: 0
			}
			off.x = d
			off.y = 0.5
			off.z = 1 / 6 + (-4.2 + Math.cos(d * 0.9332) * 4.2) / 3.25

			return off;
		},
		span: 1,
		finalo: {
			x: 1,
			y: 0,
			z: -2 / 3
		},
		rotchange: 0,
		size: {x:1,y:1,z:0},
		slope: 1
	}, { //superslopedown Track Piece facing x direction
		offsets: function(d) {
			var off = {
				x: 0,
				y: 0,
				z: 0
			}
			off.x = (d / 1.5275)
			off.y = 0.5
			off.z = 1 / 3 - (d / 1.5275) * 4 / 3
			return off;
		},
		span: 1.5275,
		finalo: {
			x: 1,
			y: 0,
			z: -4 / 3
		},
		rotchange: 0,
		size: {x:1,y:1,z:-2},
		slope: 1
	}, { //superslopedown -> str Track Piece facing x direction
		offsets: function(d) {
			var off = {
				x: 0,
				y: 0,
				z: 0
			}
			off.x = d
			off.y = 0.5
			off.z = -1 / 6 + (4.2 - Math.cos(0.9332 - d * 0.9332) * 4.2) / 3.25
			return off;
		},
		span: 1,
		finalo: {
			x: 1,
			y: 0,
			z: -1 / 3
		},
		rotchange: 0,
		size: {x:1,y:1,z:0},
		slope: 3
	}, 

	{ //loop
		offsets: function(d) {
			var off = {
				x: 0,
				y: 0,
				z: 0
			}
			off.x = Math.sin(2*Math.PI*d/8.5)*1.5+(3*d/8.5);
			off.y = 1-Math.cos((Math.PI)*d/8.5)/2;
			off.z = 1/6+1.5-Math.cos(2*Math.PI*d/8.5)*1.5;
			off.up = [Math.cos(2*Math.PI*d/8.5), Math.sin(2*Math.PI*d/8.5), 1, 0]
			return off;
		},
		span: 8.5,
		finalo: {
			x: 3,
			y: 1,
			z: 0
		},
		rotchange: 0,
		size: {x:3,y:2,z:3},
		slope: 3
	},

	]

	//TRACK FUNCTION REFERENCE
	/*
	0 - straight
	1 - turn right 2x2
	2 - turn left 2x2
	3 - turn right 3x3
	4 - turn left 3x3
	5 - begin slope up
	6 - slope up
	7 - end slope up
	8 - slope up right 2x2
	9 - slope up left 2x2 
	10 - begin slope down
	11 - slope down
	12 - end slope down
	13 - slope down right 2x2
	14 - slope down left 2x2 
	15 - begin steep slope up
	16 - steep slope up
	17 - end steep slope up
	18 - begin steep slope down
	19 - steep slope down
	20 - end steep slope down
	*/

	var pieceNames = [
		"Straight",
		"Small Right Turn",
		"Small Left Turn",
		"Large Right Turn",
		"Large Left Turn",
		"Begin Up Slope",
		"Up Slope",
		"Level",
		"Up Right Turn",
		"Up Left Turn",
		"Begin Down Slope",
		"Down Slope",
		"Level",
		"Down Right Turn",
		"Down Left Turn",
		"Steep Up Slope",
		"Steep Up Slope",
		"Level",
		"Steep Down Slope",
		"Steep Down Slope",
		"Level"
	]


	var loadingTrack = { 
		pieces: [19, 19, 20, 21, 15, 16, 16],
		startrot: 0,
		startpos: {
			x: 0,
			y: 4,
			z: 9 / 3
		}
	};
	
	var tracks = [ 

	/*

	{ 
		pieces: [18, 19, 20, 5, 7, 3, 5],
		startrot: 0,
		startpos: {
			x: 0,
			y: 0,
			z: 7 / 3
		}
	}, {
		pieces: [0, 1, 5, 7, 10, 12, 1, 0, 15],
		startrot: 1,
		startpos: {
			x: 8,
			y: 6,
			z: 0
		}
	}, {
		pieces: [20, 1, 0, 1, 5],
		startrot: 3,
		startpos: {
			x: 0,
			y: 4,
			z: 1 / 3
		}
	}, {
		pieces: [20, 0, 15],
		startrot: 1,
		startpos: {
			x: 5,
			y: 5,
			z: 1 / 3
		}
	}, */
/*
	{
		pieces: [0, 0, 0],
		startrot: 0,
		startpos: {
			x: 3,
			y: 9,
			z: 0
		},
		endrot: 0,
		endpos: {
			x: 6,
			y: 9,
			z: 0
		}
	}
	*/
	]
	var coasters = []

	this.scopeEval = function(evalt) {
		return eval(evalt)
	};
	var ctx = canvas.getContext("2d");
	var width = canvas.width;
	var viewcenter = width / 2;
	var height = canvas.height;

	var rotselectMap = [

	//from vertdown
	[[-1,-1,-1,-1,-1,-1,-1],
	[-1,-1,-1,-1,-1,-1,-1],
	[-1,-1,-1,-1,-1,-1,-1],
	[-1,-1,-1,-1,-1,-1,-1],
	[-1,-1,-1,-1,-1,-1,-1]],

	//from steepslopedown
	[[-1,-1,-1,-1,-1,-1,-1],
	[-1,-1,-1,-1,-1,-1,-1],
	[-1,19,-1,20,-1,-1,-1],
	[-1,-1,-1,-1,-1,-1,-1],
	[-1,-1,-1,-1,-1,-1,-1]],

	//from slopedown
	[[-1,-1,-1,-1,-1,-1,-1],
	[-1,-1,14,-1,-1,-1,-1],
	[-1,-1,11,12,-1,-1,-1],
	[-1,-1,13,-1,-1,-1,-1],
	[-1,-1,-1,-1,-1,-1,-1]],

	//from flat
	[[-1,-1,-1, 4,-1,-1,-1],
	[-1,-1,-1, 2,-1,-1,-1],
	[-1,18,10, 0, 5,15,-1],
	[-1,-1,-1, 1,-1,-1,-1],
	[-1,-1,-1, 3,-1,-1,-1]],

	//from slopeup
	[[-1,-1,-1,-1,-1,-1,-1],
	[-1,-1,-1,-1, 9,-1,-1],
	[-1,-1,-1, 7, 6,-1,-1],
	[-1,-1,-1,-1, 8,-1,-1],
	[-1,-1,-1,-1,-1,-1,-1]],

	//from steepslopeup
	[[-1,-1,-1,-1,-1,-1,-1],
	[-1,-1,-1,-1,-1,-1,-1],
	[-1,-1,-1,17,-1,16,-1],
	[-1,-1,-1,-1,-1,-1,-1],
	[-1,-1,-1,-1,-1,-1,-1]],

	//from vertup
	[[-1,-1,-1,-1,-1,-1,-1],
	[-1,-1,-1,-1,-1,-1,-1],
	[-1,-1,-1,-1,-1,-1,-1],
	[-1,-1,-1,-1,-1,-1,-1],
	[-1,-1,-1,-1,-1,-1,-1]]

	]

	var imageURLs =

	[
		"gloSlope.png", "noSlope.png", "floatgrid.png", "arrows.png", "arrow.png", "ghost.png", "tileMap.png", "UI/ArrowU.png", "UI/ArrowS.png", "UI/RightU.png", "UI/RightS.png", "UI/LeftU.png", "UI/LeftS.png", "UI/SRightS.png", "UI/SRightU.png", "UI/SLeftU.png", "UI/SLeftS.png", "UI/UIBG.png"
	];

	var soundURLs = [];
	var images = [];
	var sounds = [];
	var trackTiles = [];
	var cameray = 0;
	var shadowCanvas = document.createElement("canvas")
	//document.body.appendChild(shadowCanvas);
	shadowCanvas.width = shadowCanvas.height = 800;

	var pieceCanvas = document.createElement("canvas")
	pieceCanvas.width = pieceCanvas.height = 180;
	var pCtx = pieceCanvas.getContext("2d");

	var sCtx = shadowCanvas.getContext("2d");
	var trackUI = [{
		type: "image",
		img: "UI/UIBG.png",
		x: 0,
		y: 0
	}, {
		type: "dir",
		img: "UI/SLeft",
		active: 0,
		x: 15,
		y: 66
	}, {
		type: "dir",
		img: "UI/Left",
		active: 1,
		x: 56,
		y: 30
	}, {
		type: "dir",
		img: "UI/Arrow",
		active: 2,
		x: 118,
		y: 6
	}, {
		type: "dir",
		img: "UI/Right",
		active: 3,
		x: 165,
		y: 30
	}, {
		type: "dir",
		img: "UI/SRight",
		active: 4,
		x: 199,
		y: 66
	}, 

	{
		type: "slope",
		rot: 0,
		active: 3,
		x: 127,
		y: 228
	},

	{
		type: "slope",
		rot: 15,
		active: 2,
		x: 102,
		y: 226,
	},

	{
		type: "slope",
		rot: -15,
		active: 4,
		x: 152,
		y: 226,
	},

	{
		type: "slope",
		rot: 30,
		active: 1,
		x: 78,
		y: 216
	},

	{
		type: "slope",
		rot: -30,
		active: 5,
		x: 176,
		y: 216
	},

	]
	//var AC = AudioContext; //unfortunately nightly's audiocontext is at the stage of "not working at all" so it and anything that isn't chrome should use legacy audio
	//if (AC == null) 
	if (typeof webkitAudioContext != "undefined") var AC = webkitAudioContext;
	var legacyAudio = (AC == null);

	var tilemWidth, tilemHeight, tileMap, Map, selectRot, selectSlope;
	var fadebuttons = [0, 0, 0, 0, 0]
	var fadeSbuttons = [0, 0, 0, 0, 0, 0, 0]
	var selectedPiece = 0;

	if (!(legacyAudio)) {
		var gameAudio = new AC();
		var buffers = [];
	}
	var globalVolume = 1;
	var t = 0;

	function updateSelectedPiece() {
		selectedPiece = rotselectMap[tracks[currentTrack].slope][selectRot][selectSlope]
		drawUIPiece(selectedPiece, tracks[currentTrack].endrot);
		//console.log(selectedPiece);
	}

	function drawTrackUI(x, y) {
		for (var i = 0; i < trackUI.length; i++) {
			var elem = trackUI[i];
			if (elem.type == "image") {
				ctx.drawImage(images[elem.img], elem.x + x, elem.y + y);
			} else if (elem.type == "dir") {

				var inactive = (rotselectMap[tracks[currentTrack].slope][elem.active][selectSlope] == -1);

				if (inactive) ctx.globalAlpha = 0.3;
				var img = images[elem.img + ((elem.active == selectRot) ? "S" : "U") + ".png"];
				ctx.drawImage(img, elem.x + x, elem.y + y);
				ctx.globalAlpha = 1;

				var tempx = mouseX - (elem.x+x+img.width/2)
				var tempy = mouseY - (elem.y+y+img.height/2)

				if ((tempy*tempy+tempx*tempx < 1000)&& !(inactive)) {
					if (fadebuttons[elem.active] < 0.5) fadebuttons[elem.active] += 0.05;
					if (mouseClicked) {selectRot = elem.active; updateSelectedPiece();}
				} else {
					if (fadebuttons[elem.active] > 0) fadebuttons[elem.active] -= 0.05;
				}
				if (fadebuttons[elem.active] > 0) {
					ctx.globalAlpha = fadebuttons[elem.active];
					ctx.drawImage(images[elem.img +"S.png"], elem.x + x, elem.y + y);
					ctx.globalAlpha = 1;
				}
			} else if (elem.type == "slope") {

				var inactive = 0;

				for (var j=0; j<5; j++) {
					if (rotselectMap[tracks[currentTrack].slope][j][elem.active] == -1) inactive++;
				}

				inactive = (inactive == 5);

				var img = images[((elem.active == selectSlope) ? "glo" : "no") + "Slope.png"];
				ctx.save();
				ctx.translate(elem.x + x, elem.y + y);
				ctx.rotate(elem.rot*Math.PI/180);
				if (inactive) ctx.globalAlpha = 0.3;
				ctx.drawImage(img, -14, -11);
				ctx.globalAlpha = 1;

				var tempx = mouseX - (elem.x+x)
				var tempy = mouseY - (elem.y+y)

				if ((tempy*tempy+tempx*tempx < 144)&& !(inactive)) {
					if (fadeSbuttons[elem.active] < 0.5) fadeSbuttons[elem.active] += 0.05;
					if (mouseClicked) {selectSlope = elem.active; updateSelectedPiece();}
				} else {
					if (fadeSbuttons[elem.active] > 0) fadeSbuttons[elem.active] -= 0.05;
				}
				if (fadeSbuttons[elem.active] > 0) {
					ctx.globalAlpha = fadeSbuttons[elem.active];
					ctx.drawImage(images["gloSlope.png"], -14, -11);
					ctx.globalAlpha = 1;
				}
				ctx.restore();
			}
		}
		ctx.drawImage(pieceCanvas, 36+x, 41+y);
		var tempx = mouseX - (127+x)
		var tempy = mouseY - (132+y)
		if (mouseClicked && (tempy*tempy+tempx*tempx < 5625)&& !(selectedPiece == -1)) {
			tracks[currentTrack].pieces.push(selectedPiece);
			drawTrackTiles(false);
			drawTrackShadow();
			updateSelectedPiece();
		}

		var tempx = mouseX - (128+x)
		var tempy = mouseY - (122+y)

		if (mouseDown && (tempy*tempy+tempx*tempx < 16384)) {
			mouseDown = false; //absorb click;
		}
	}

	/*function AxisAngleTransform2(v, n, dir) {
		var cosT = Math.cos(dir); 
		var sinT = Math.sin(dir);
		var step1 = [v.x*cosT, v.y*cosT, v.z*cosT];
		var step2 = [((-n.z)*(v.y)+(n.y)*v.z)*sinT, ((n.z)*(v.x)-(n.x)*v.z)*sinT, ((-n.y)*(v.x)+(n.x)*v.y)*sinT]
		var dot = (n.x*v.x+n.y*v.y+n.z*v.z)*(1-cosT);
		var step3 = [n.x*dot, n.y*dot, n.z*dot]
		return [step1[0]+step2[0]+step3[0], step1[1]+step2[1]+step3[1], step1[2]+step2[2]+step3[2]]
	}*/

	/* function AxisAngleTransform2(v, n, dir) { //kill me
		var cosT = Math.cos(dir); 
		var sinT = Math.sin(dir);
		var R = [ //kill me now
			cosT+(n.x*n.x)*(1-cosT), n.x*n.y*(1-cosT)-n.z*sinT, n.x*n.z*(1-cosT)+n.y*sinT,
			n.y*n.x*(1-cosT)+n.z*sinT, cosT+(n.y*n.y)*(1-cosT), n.y*n.z*(1-cosT)-n.x*sinT,	
			n.z*n.x*(1-cosT)-n.y*sinT, n.z*n.y*(1-cosT)-n.x*sinT, cosT+(n.z*n.z)*(1-cosT),		
		]
		return [v.x*R[0]+v.y*R[1]+v.z*R[2], v.x*R[3]+v.y*R[4]+v.z*R[5], v.x*R[6]+v.y*R[7]+v.z*R[8]];
	}

	function AxisAngleTransform(target, v, dir) { //third time's the charm???
		var n = {x: 1, y: 0, z: 0}
		var step1 = {x:((-n.z)*(v.y)+(n.y)*v.z), y:((n.z)*(v.x)-(n.x)*v.z), z:((-n.y)*(v.x)+(n.x)*v.y)};
		var step2 = Math.acos(n.x*v.x+n.y*v.y+n.z*v.z)
		var temp = v
		var v = {x: v.z, y: v.y, z: v.x}
		var step3 = {x:((-n.z)*(v.y)+(n.y)*v.z), y:((n.z)*(v.x)-(n.x)*v.z), z:((-n.y)*(v.x)+(n.x)*v.y)};
		v = temp
		n = step3
		var dot = n.x*v.x+n.y*v.y+n.z*v.z
		if (dot < 0) { step2 = -step2; alert("fuck")}

		temp = AxisAngleTransform2(target, step1, step2);
		//temp[2] = target.z;
		return temp;
	} */

	function AxisAngleTransform(t, n) {
		xymag = Math.sqrt((n.x * n.x) + (n.y * n.y));

		if (n.up != null) { 
		t = {
			x: t.x * n.up[0] - t.z * n.up[1],
			y: t.y,
			z: t.z * n.up[0] + t.x * n.up[1]
		};
		n.x = n.up[2]
		n.y = n.up[3]
		} else {//loop code

		t = {
			x: t.x * xymag - t.z * n.z,
			y: t.y,
			z: t.z * xymag + t.x * n.z
		};

		}
		var mag2 = Math.sqrt((n.x * n.x) + (n.y * n.y))
		n.x = n.x / mag2
		n.y = n.y / mag2
		return [t.x * n.x - t.y * n.y, t.y * n.x + t.x * n.y, t.z]
	}

	function loadFiles(percentCallback) {
		var ftotal = imageURLs.length + soundURLs.length;
		var fload = 0;
		for (var i = 0; i < imageURLs.length; i++) {
			var url = imageURLs[i]
			images[url] = new Image();
			images[url].src = url;
			images[url].onload = function(e) {
				percentCallback(ftotal, ++fload);
			};
		}
		for (var i = 0; i < soundURLs.length; i++) {
			var url = soundURLs[i]
			if (legacyAudio) {
				sounds[url] = new Audio();
				sounds[url].src = url;
				sounds[url].oncanplaythrough = function(e) {
					percentCallback(ftotal, ++fload);
				};
			} else {
				var req = new XMLHttpRequest();
				req.open("GET", url);
				req.send();
				req.responseType = 'arraybuffer';
				req.onreadystatechange = function() {
					if (this.readyState == this.DONE) {
						try {
							gameAudio.decodeAudioData(this.response, function(buffer) {
								sounds[url] = buffer;
								percentCallback(ftotal, ++fload);
							}, function(){alert("sound could not be read!")});
						} catch(err) {
							percentCallback(ftotal, ++fload);
						}
					}
				}
			}
		}
	}

	loadFiles(loadedF);
	console.log("hi");
	var currentTrack = 0;

	setInterval(update, 16);
	tracks.push(loadingTrack);
	var map = new Map(10, 10, 100);
	cameray = -275;
	var loading = true;
	drawTrackTiles(false);
	drawTrackShadow();
	putACoasterThere();

	function loadedF(ftotal, fload) {
		var scale = fload / ftotal;
		if (fload == ftotal) init();
	}

	function init() {
		//playSound(sounds["latin6.mp3"]);
		loading = false;
		tileMap = images["tileMap.png"]
		tilemHeight = tileMap.height / 60;
		tilemWidth = tileMap.width / 80;
		map = new Map(10, 10, 100);
		cameray = -275;
		selectRot = 2;
		selectSlope = 3;
		tracks = [{
			pieces: [0, 0, 0],
			startrot: 0,
			startpos: {
				x: 3,
				y: 9,
				z: 0,
			}
		}];
		coasters = [];
		currentTrack = 0;
		drawTrackTiles(false);
		drawTrackShadow();
		//drawUIPiece(0, tracks[currentTrack].endrot);
		updateSelectedPiece();
	}

	function putACoasterThere() {
		var id = coasters.push(new Coaster("front"))-1;
		coasters[id].track = 0;
		coasters[id].v = 0;
		coasters[id].calculateTPosition();
	}

	function Map(width, breadth, height) {
		this.data = [];
		var spritePartition = [];
		this.sprites = [];
		for (var y = 0; y < breadth; y++) {
			this.data[y] = [];
			spritePartition[y] = [];
			for (var x = 0; x < breadth; x++) {
				this.data[y][x] = new Array(height);
				spritePartition[y][x] = new Array(height);
				//this.sprites.push(new isoSprite(images["ghost.png"], x+0.5, y+0.5, 0))
				for (var z = 0; z < height; z++) {
					this.data[y][x][z] = -1;
					spritePartition[y][x][z] = [];
				}
			}
		}
		this.spritePartition = JSON.stringify(spritePartition);
	}

	function isoSprite(image, x, y, z) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.img = image;
		this.imgctrx = image.width / 2;
		this.imgctry = image.height / 2;
	}

	function Coaster(type, x, y, z) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.xv = 0; //when off rails
		this.yv = 0;
		this.zv = 0;
		this.v = 0; //when attached
		this.track = -1; //attached track, -1 when none
		this.tracko = -1;
		this.dDir = 1; //going along track backwards or forwards?
		this.type = type;
		this.sprite = new isoSprite(images["ghost.png"], x, y, z)
		this.d = 0;
		this.trackProgress = 0;
		this.trackDir = 0;
		this.tx = 0;
		this.ty = 0;
		this.tz = 0;
		this.airTime = 0;
		this.moveSprite = function() {
			this.sprite.x = this.x
			this.sprite.y = this.y
			this.sprite.z = this.z
		}
		this.calculateTPosition = function() {
			this.tx = tracks[this.track].startpos.x;
			this.ty = tracks[this.track].startpos.y;
			this.tz = tracks[this.track].startpos.z;
			this.trackDir = tracks[this.track].startrot;
			var costd = Math.cos(this.trackDir * (Math.PI / 2));
			var sintd = Math.sin(this.trackDir * (Math.PI / 2));
			for (var i = 0; i < this.trackProgress; i++) {
				var piece = trackpieces[tracks[this.track].pieces[i]]
				var o = piece.finalo
				this.tx += o.x * costd - o.y * sintd;
				this.ty += o.x * sintd + o.y * costd;
				this.tz += o.z;
				this.trackDir = (this.trackDir + piece.rotchange) & 3;
				var costd = Math.cos(this.trackDir * (Math.PI / 2));
				var sintd = Math.sin(this.trackDir * (Math.PI / 2));
			}
		}
		map.sprites.push(this.sprite)
	}

	function playSound(audio, volume) {
		var volume = volume || 1;
		if (legacyAudio) {
			audio.currentTime = 0;
			audio.targetVolume = volume;
			audio.volume = volume;
			audio.play();
		} else {
			var bid = buffers.push(gameAudio.createBufferSource()) - 1;
			buffers[bid].buffer = audio;
			buffers[bid].targetVolume = volume;
			buffers[bid].volumeNode = gameAudio.createGainNode();
			buffers[bid].volumeNode.gain.value = volume * globalVolume;
			buffers[bid].connect(buffers[bid].volumeNode);
			buffers[bid].volumeNode.connect(gameAudio.destination);
			buffers[bid].noteOn(0);
		}
	}

	function globalVolumeChange(newv) {
		globalVolume = newv;
		if (legacyAudio) {
			audio.volume = audio.targetVolume * newv;
		} else {
			for (var i = 0; i < buffers.length; i++) {
				buffers[i].volumeNode.gain.value = buffers[i].targetVolume * newv;
			}
		}
	}

	var mouseClickY;
	var camerayv = 0;

	function update() {
		for (var coast=0; coast<coasters.length; coast++) {
			processMovement(coast);
		}
		if (mouseClicked) {
			mouseClickY = mouseY;
		}
		if (mouseDown) {
			camerayv = mouseClickY - mouseY;
			mouseClickY = mouseY;
		}

		cameray += camerayv;
		camerayv = camerayv*0.9;

		if (cameray> -275) cameray = -275;
		render();

		mouseClicked = false;

		//t += 0.03;
		//drawUIPiece(Math.floor(t)%21);
	}

	var coasterPoints = [

		{x:0.3 ,y: 0.2, z:0.075},
		{x:-0.3 ,y: 0.2, z:0.075},
		{x:-0.3 ,y: -0.2, z:0.075},
		{x:0.3 ,y: -0.2, z:0.075},

		{x:0.3 ,y: 0.2, z:0.275},
		{x:-0.3 ,y: 0.2, z:0.275},
		{x:-0.3 ,y: -0.2, z:0.275},
		{x:0.3 ,y: -0.2, z:0.275},

		{x:0.15 ,y: 0.2, z:0.275},
		{x:0.15 ,y: 0.2, z:0.2},
		{x:-0.15 ,y: 0.2, z:0.2},
		{x:-0.15 ,y: 0.2, z:0.275},

		{x:0.15 ,y: -0.2, z:0.275},
		{x:0.15 ,y: -0.2, z:0.20},
		{x:-0.15 ,y: -0.2, z:0.20},
		{x:-0.15 ,y: -0.2, z:0.275},
	] 

	var coasterSurfaces = [
		[0,1,2,3],
		[0,1,5,11,10,9,8,4],
		[2,3,7,12,13,14,15,6],
		[1,2,6,5],
		[0,3,7,4]
	]



	function generateCoasterSprite(coaster, normal) {

		var projected = []

		for (var i=0; i<coasterPoints.length; i++) {
			var s = AxisAngleTransform(coasterPoints[i], normal);
			//alert(JSON.stringify(s));
			projected.push([s[0]*40 - s[1]*40+40, (s[0] + s[1]) * 20 - s[2] * 60+40, s[0]+s[1]]);
		}

		var drawOrder = [];

		for (var i=0; i<coasterSurfaces.length;i++) {
			var tot = 0;
			for (var j=0; j<coasterSurfaces[i].length; j++) {
				tot += projected[coasterSurfaces[i][j]][2];
			}
			drawOrder.push([i, tot/coasterSurfaces[i].length])
		}

		drawOrder.sort(function(x,y) { return x[1] > y[1] });

		var coca = document.createElement("canvas");
		coca.width = coca.height = 80;
		var cctx = coca.getContext("2d");

		cctx.strokeStyle = "#000000"
		cctx.fillStyle = "#FFFFFF"
		cctx.lineWidth = 1;

		for (var i=0; i<drawOrder.length;i++) {
			var item = coasterSurfaces[drawOrder[i][0]]
			cctx.beginPath();
			var flag = true;
			for (var j=0; j<item.length; j++) {
				if (flag) { flag = false; cctx.moveTo(projected[item[j]][0], projected[item[j]][1]); }
				else { cctx.lineTo(projected[item[j]][0], projected[item[j]][1]); }
			}
			cctx.fill();
			cctx.stroke();
		}

		coaster.sprite.img = coca;
		coaster.sprite.imgctrx = 40	
		coaster.sprite.imgctry = 40		
	}

	function processMovement(num) {


		var coaster = coasters[num];
		coaster.d += coaster.v;

		if (coaster.track != -1) {

			var track = tracks[coaster.track].pieces;
			var trackpiece = coaster.trackProgress;
			var xl = coaster.tx
			var yl = coaster.ty
			var zl = coaster.tz
			var trackdir = coaster.trackDir
			costd = Math.round(Math.cos(trackdir * (Math.PI / 2)));
			sintd = Math.round(Math.sin(trackdir * (Math.PI / 2)));
			var piece = trackpieces[track[trackpiece]];


			var prx = coaster.x;
			var pry = coaster.y;
			var prz = coaster.z;
			var o = piece.offsets(coaster.d);
			var ox = o.x * costd - o.y * sintd;
			var oy = o.y * costd + o.x * sintd;
			var p = piece.offsets(coaster.d + 0.01);
			var px = p.x * costd - p.y * sintd;
			var py = p.y * costd + p.x * sintd;
			coaster.x = ox + coaster.tx;
			coaster.y = oy + coaster.ty;
			coaster.z = o.z + coaster.tz;
			if (!(loading)) coaster.v = coaster.v * 0.9993;



			coaster.moveSprite();

			var mag = Math.sqrt((ox - px) * (ox - px) + (oy - py) * (oy - py) + (o.z - p.z) * (o.z - p.z));
			var normal = {x:(px-ox)/mag, y:(py-oy)/mag, z:(p.z-o.z)/mag, up:o.up};
			generateCoasterSprite(coaster, normal);

			coaster.v += ((o.z - p.z) / mag) * 0.15 / 60;

			if (coaster.d < 0) {
				coaster.trackProgress--;
				if (coaster.trackProgress < 0) {
					coaster.track = -1;
					coaster.xv = (coaster.x - prx);
					coaster.yv = (coaster.y - pry);
					coaster.zv = (coaster.z - prz);
					return;
					coaster.airTime = 0;
				}
				var piece = trackpieces[track[coaster.trackProgress]];

				coaster.trackDir = (coaster.trackDir - piece.rotchange) & 3;
				costd = Math.round(Math.cos(trackdir * (Math.PI / 2)));
				sintd = Math.round(Math.sin(trackdir * (Math.PI / 2)));


				coaster.d += piece.span;
				coaster.tx -= piece.finalo.x * costd + piece.finalo.y * sintd;
				coaster.ty -= piece.finalo.y * costd + piece.finalo.x * sintd;
				coaster.tz -= piece.finalo.z;

			} else if (coaster.d >= piece.span) {
				coaster.d -= piece.span;
				coaster.tx += piece.finalo.x * costd - piece.finalo.y * sintd;
				coaster.ty += piece.finalo.y * costd + piece.finalo.x * sintd;
				coaster.tz += piece.finalo.z;
				coaster.trackDir = (coaster.trackDir + piece.rotchange) & 3;
				costd = Math.round(Math.cos(trackdir * (Math.PI / 2)));
				sintd = Math.round(Math.sin(trackdir * (Math.PI / 2)));
				if (++coaster.trackProgress >= track.length) {
					coaster.track = -1;
					coaster.xv = (coaster.x - prx);
					coaster.yv = (coaster.y - pry);
					coaster.zv = (coaster.z - prz);
					coaster.airTime = 0;
				}
			}
			coaster.tz = Math.round(coaster.tz*3)/3;
			coaster.tracko = coaster.track;
		} else {
			coaster.airTime++;
			coaster.zv -= 0.15 / 60
			coaster.x += coaster.xv;
			coaster.y += coaster.yv;
			coaster.z += coaster.zv;
			if (coaster.z < 0) {
				coaster.z = 0;
				coaster.zv = -coaster.zv
			}
			if (coaster.airTime < 20) exempt = coaster.tracko;
			else exempt = null;
			var col = checkClosestCollider(coaster.x, coaster.y, coaster.z, 0.075, exempt);
			if (col[0] != -1) {
				coaster.track = col[1];
				coaster.trackProgress = col[0];
				coaster.v = coaster.xv * col[3] + coaster.yv * col[4] + coaster.zv * col[5];
				coaster.calculateTPosition();
				coaster.d = col[2];
			}
			coaster.moveSprite();

		}

	}


	function render() {

		ctx.fillStyle = "#333333"
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		var spritePartition = JSON.parse(map.spritePartition);
		for (var i = 0; i < map.sprites.length; i++) {
			var spr = map.sprites[i];
			try {
				var pos = spritePartition[Math.floor(spr.y)][Math.floor(spr.x)][Math.floor(spr.z) * 3]
				var arrins = pos.length;
				for (var j = 0; j < pos.length; j++) {
					if ((map.sprites[pos[j]].x + map.sprites[pos[j]].y > spr.x + spr.y) && (arrins > j)) arrins = j;
				}
				pos.splice(arrins, 0, i);
			} catch (err) {
				//went outside bounds, how did that happen???
				continue; // just skip this sprite
			}

		}

		if (!(loading)){
			for (var x=0;x<10;x++){
				for (var y=0;y<10;y++) {
					drawTile(tileMap, x, y, 0, 0)
				}
			}
		}


		var x = 0;
		var y = 0;
		var yinc = 0;
		var editp = tracks[currentTrack].endpos;
		var endr = tracks[currentTrack].endrot;
		var fixp = [Math.round(editp.x), Math.round(editp.y), Math.round(editp.z)]
		switch (endr) {
			case 1:
			fixp[0]--;
			break;
			case 2:
			fixp[0]--;
			fixp[1]--;
			break;
			case 3:
			fixp[1]--;
			break;
		}

		if (!(loading)) drawTile(images["arrows.png"], fixp[0], fixp[1], 0, endr);

		ctx.globalAlpha = 0.5;
		ctx.drawImage(shadowCanvas, 0, 0, 800, 800, viewcenter-400, 20-cameray, 800, 400);
		ctx.globalAlpha = 1;

		while (yinc < 20) {
			while (y >= 0 && x < 10) {
				for (var z = 0; z < 100; z++) {
					if (z == fixp[2] && !(loading)) {
						if (z > 0) {
							ctx.globalAlpha = Math.max(0.5, 1-Math.abs(x-fixp[0])/10-Math.abs(y-fixp[1])/10);
							drawTile(images["floatgrid.png"], x, y, z, 0)
							ctx.globalAlpha = 1;
						}
						if ((x == fixp[0]) && (y == fixp[1])) {
							drawTile(images["arrow.png"], fixp[0], fixp[1], fixp[2], endr);
						}
					}
					if (map.data[y][x][z] != -1) {
						drawTrack(x, y, z, map.data[y][x][z]);
					}
					for (var i = 0; i < spritePartition[y][x][z].length; i++) {
						drawSprite(map.sprites[spritePartition[y][x][z][i]]);
					}
				}
				x++;
				y--;
			}
			yinc++;
			if (yinc >= 10) {
				y = 9;
				x = yinc - 9
			} else {
				x = 0;
				y = yinc
			}
		}

		//drawTrack(true);
		//drawTrack(false);
		if (!(loading)) { drawTrackUI(768, 10);
		} else {
			ctx.font = "20pt Arial Bold"
			ctx.fillStyle = "#FFFFFF"
			ctx.strokeStyle = "#111111"
			ctx.lineWidth = 5;
			var s = "Loading"
			var p = canvas.width/2-ctx.measureText(s).width/2
			for (var m=0;m<s.length;m++) {
				ctx.strokeText(s[m], p, 600);
				ctx.fillText(s[m], p, 600);
				p+=ctx.measureText(s[m]).width
			}
		}

		/*for (var x=0; x<10; x++) {
			for (var y=0; y<10; y++) {
				drawTile(x, y, 0, 0);
			}
		}*/
	}

	function drawTile(tileMap, x, y, height, tile) {
		var tilemWidth = tileMap.width / 80;
		ctx.drawImage(tileMap, (tile % tilemWidth) * 80, Math.floor(tile / tilemWidth) * 60, 80, 60, (viewcenter - 40) + x * 40 - y * 40, (x + y) * 20 - height * 20 - cameray, 80, 60);
	}

	function drawTrack(x, y, height, tile) {
		ctx.drawImage(trackTiles[tile], (viewcenter - 50) + x * 40 - y * 40, (x + y) * 20 - height * 20 - cameray-10);
	}

	function drawSprite(s) {
		try { ctx.drawImage(s.img, viewcenter + s.x * 40 - s.y * 40 - s.imgctrx, (s.x + s.y) * 20 - s.z * 60 - s.imgctry + 20 - cameray); } catch(e) {}
	}

	function drawTrackTiles(shadow) { //backup realtime track drawer

			var bars1, bars2, tris, tris2, mbar, ctTx, ctTy, ctTz, tCtx;
			var usedtiles = [];
			trackTiles = [];

		function prepareNewTrackTile(x, y, z, followon, c) {
			if (!(followon) || (bars1.length == 0)) {
				bars1 = [];
				bars2 = [];
				mbar = [];
			} else {
				var prev = bars1[bars1.length-1]
				bars1 = [[prev[0]+c.x, prev[1]+c.y, prev[2]+c.z]];
				var prev = bars2[bars2.length-1]
				bars2 = [[prev[0]+c.x, prev[1]+c.y, prev[2]+c.z]];
				var prev = mbar[mbar.length-1]
				mbar = [[prev[0]+ c.x * 40 - c.y * 40, prev[1] + (c.x + c.y) * 20 - c.z * 60]];
			}
			tris = [];
			tris2 = [];
			ctTx = x;
			ctTy = y;
			ctTz = z;
			var temp = x+","+y+","+Math.floor(z*3);
			if (usedtiles.indexOf(temp) == -1) {
				usedtiles.push(temp);
				trackTiles.push(document.createElement("canvas"));
				//document.body.appendChild(trackTiles[trackTiles.length-1])
				tCtx = trackTiles[trackTiles.length-1].getContext("2d");
				trackTiles[trackTiles.length-1].width = 100;
				trackTiles[trackTiles.length-1].height = 80;
				map.data[ctTy][ctTx][Math.floor(ctTz*3)] = trackTiles.length-1;
			} else {
				tCtx = trackTiles[usedtiles.indexOf(temp)].getContext("2d");
			}
		}

		ctx.beginPath();


		for (var i = 0; i < tracks.length; i++) {

			var tricount = 0;
			var track = tracks[i].pieces;
			var trackpiece = 0;
			var d = 0;
			var xl = tracks[i].startpos.x;
			var yl = tracks[i].startpos.y;
			var zl = tracks[i].startpos.z;
			var trackdir = tracks[i].startrot;
			costd = Math.round(Math.cos(trackdir * (Math.PI / 2)));
			sintd = Math.round(Math.sin(trackdir * (Math.PI / 2)))
			var px = null,
				py = null,
				pz = null
			var started = false;
			prepareNewTrackTile(xl, yl, zl, false);

			var piece;
			while (trackpiece < track.length) {

				piece = trackpieces[track[trackpiece]];
				while (d < piece.span) {
					var o = piece.offsets(d);
					var ox = o.x * costd - o.y * sintd;
					var oy = o.y * costd + o.x * sintd;
					tricount++;

					if (px != null) {
						var mag = Math.sqrt(Math.pow(((ox + xl) - px), 2) + Math.pow(((oy + yl) - py), 2) + Math.pow(((o.z + zl) - pz), 2));
						var normal = {
							x: ((ox + xl) - px) / mag,
							y: ((oy + yl) - py) / mag,
							z: ((o.z + zl) - pz) / mag,
							up:o.up
						};

						var bar1 = AxisAngleTransform({
							x: 0,
							y: 0.20,
							z: 0.10
						}, normal, 0);
						bar1[0] += (ox + xl-ctTx);
						bar1[1] += (oy + yl-ctTy);
						bar1[2] += (o.z + zl-ctTz);
						bars1.push(bar1);

						var bar2 = AxisAngleTransform({
							x: 0,
							y: -0.20,
							z: 0.10
						}, normal, 0);
						bar2[0] += (ox + xl-ctTx);
						bar2[1] += (oy + yl-ctTy);
						bar2[2] += (o.z + zl-ctTz);
						bars2.push(bar2);

						if (tricount % 4 == 2) {
							var temp = [AxisAngleTransform({x:0, y:0.05, z:0.05}, normal, 0), bar1, AxisAngleTransform({x:0, y:0.05, z:-0.05}, normal, 0)];
							var temp2 = [AxisAngleTransform({x:0, y:-0.05, z:0.05}, normal, 0), bar2, AxisAngleTransform({x:0, y:-0.05, z:-0.05}, normal, 0)];
							temp[0][0] += (ox+xl-ctTx); temp[0][1] += (oy+yl-ctTy); temp[0][2] += (o.z+zl-ctTz);
							temp[2][0] += (ox+xl-ctTx); temp[2][1] += (oy+yl-ctTy); temp[2][2] += (o.z+zl-ctTz);
							temp2[0][0] += (ox+xl-ctTx); temp2[0][1] += (oy+yl-ctTy); temp2[0][2] += (o.z+zl-ctTz);
							temp2[2][0] += (ox+xl-ctTx); temp2[2][1] += (oy+yl-ctTy); temp2[2][2] += (o.z+zl-ctTz);
							if (bar1[0] + bar1[1] > bar2[0] + bar2[1]) {
								tris.push(temp2);
								tris2.push(temp);
							} else {
								tris.push(temp);
								tris2.push(temp2);
							}
						}

					}
					var cx = (xl + ox-ctTx) * 40 - (yl + oy-ctTy) * 40 + 50
					var cy = ((xl + ox-ctTx) + (yl + oy-ctTy)) * 20 - (zl + o.z-ctTz) * 60 + 30

					mbar.push([cx, cy])

					d += 0.1;
					px = ox + xl;
					py = oy + yl;
					pz = o.z + zl;

					var newPiece = false;
					var c = {x:0, y:0, z:0}
					if (((xl+ox)-ctTx) < 0) { ctTx--; newPiece = true; c.x++}
					if (((xl+ox)-ctTx) > 1) { ctTx++; newPiece = true; c.x--}
					if (((yl+oy)-ctTy) < 0) { ctTy--; newPiece = true; c.y++}
					if (((yl+oy)-ctTy) > 1) { ctTy++; newPiece = true; c.y--}
					if (((zl+o.z)-ctTz) < 0) { ctTz -= 1/3; newPiece = true; c.z += 1/3}
					if (((zl+o.z)-ctTz) > 1/3) { ctTz += 1/3; newPiece = true; c.z -= 1/3}	
					if (newPiece) {drawTrackPiece(); prepareNewTrackTile(ctTx, ctTy, Math.round(ctTz*3)/3, true, c);}
				}
				d -= piece.span;
				xl += piece.finalo.x * costd - piece.finalo.y * sintd;
				yl += piece.finalo.y * costd + piece.finalo.x * sintd;
				zl += piece.finalo.z;
				zl = Math.round(zl*3)/3
				trackdir = (trackdir + piece.rotchange) & 3;
				costd = Math.round(Math.cos(trackdir * (Math.PI / 2)));
				sintd = Math.round(Math.sin(trackdir * (Math.PI / 2)));
				trackpiece++;

			}

			drawTrackPiece();

 			tracks[i].endpos = {x:xl, y:yl, z:Math.round(zl*3)};
 			tracks[i].endtile = {x:ctTx, y:ctTy, z:ctTz};
 			tracks[i].endrot = trackdir;
 			tracks[i].slope = piece.slope;
 			if (tracks[i].slope == null) tracks[i].slope = 3;
		}

		function drawTrackPiece() {

			tCtx.lineWidth = 1;
			tCtx.fillStyle = "#FFFFFF"
			tCtx.strokeStyle = "#000000"
			tridraw(tris);

			tCtx.beginPath();
		for (var b = 0; b < mbar.length; b++) {
			var item = mbar[b]
			if (b == 0) {
				tCtx.moveTo(item[0], item[1]);
			} else tCtx.lineTo(item[0], item[1]);
		}

			tCtx.strokeStyle = "#000000"
			tCtx.lineWidth = 7;
			tCtx.stroke();
			tCtx.strokeStyle = "#FFFFFF"
			tCtx.lineWidth = 5;
			tCtx.stroke();	

			tCtx.lineWidth = 1;
			tCtx.fillStyle = "#FFFFFF"
			tCtx.strokeStyle = "#000000"

			tridraw(tris2);

			tCtx.beginPath();

			bardraw(bars1);
			bardraw(bars2);

			tCtx.strokeStyle = "#000000"
			tCtx.lineWidth = 4;
			tCtx.stroke();
			tCtx.strokeStyle = "#FFFFFF"
			tCtx.lineWidth = 2;
			tCtx.stroke();

			function bardraw(bars) {
				var flag = true;
				for (var b = 0; b < bars.length; b++) {
					if (bars[b] == -1) {
						flag = true;
						continue;
					};
					var cx = bars[b][0] * 40 - bars[b][1] * 40 + 50
					var cy = (bars[b][0] + bars[b][1]) * 20 - bars[b][2] * 60 + 30
					if (flag) {
						tCtx.moveTo(cx, cy);
						flag = false
					} else tCtx.lineTo(cx, cy);
				}
			}	

			function tridraw(tris) {
				for (var t = 0; t < tris.length; t++) {
					tCtx.beginPath();
					for (var p = 0; p < 4; p++) {
						var item = tris[t][p % 3];
						var cx = item[0] * 40 - item[1] * 40 + 50
						var cy = (item[0] + item[1]) * 20 - item[2] * 60 + 30
						if (p == 0) {
							tCtx.moveTo(cx, cy);
						} else tCtx.lineTo(cx, cy);
					}
					tCtx.fill();
					tCtx.stroke();
				}
			}	
		}
	}

	function drawTrackShadow() { //backup realtime track drawer
		sCtx.beginPath();
		sCtx.clearRect(0,0,800,800);
		var bars1 = [];
		var bars2 = [];
		var tris = [];
		var tris2 = [];
		var tricount = 0;
		for (var i=0; i<tracks.length; i++) {
		
		var track = tracks[i].pieces;
		var trackpiece = 0;
		var d = 0;
		var xl=tracks[i].startpos.x;
		var yl=tracks[i].startpos.y;
		var zl=tracks[i].startpos.z;
		var trackdir = tracks[i].startrot;
		costd = Math.round(Math.cos(trackdir*(Math.PI/2)));
		sintd = Math.round(Math.sin(trackdir*(Math.PI/2)))
		var px = null, py = null, pz = null
		var started = false;


		while (trackpiece < track.length) {
			var piece = trackpieces[track[trackpiece]];
			while (d < piece.span) {
				var o = piece.offsets(d);
				var ox = o.x*costd-o.y*sintd;
				var oy = o.y*costd+o.x*sintd;
				tricount++;

				if (px != null) {
					var mag = Math.sqrt(Math.pow(((ox+xl)-px), 2)+Math.pow(((oy+yl)-py), 2)+Math.pow(((o.z+zl)-pz), 2));
					var normal = {x:((ox+xl)-px)/mag, y:((oy+yl)-py)/mag, z:((o.z+zl)-pz)/mag, up:o.up};

					var bar1 = AxisAngleTransform({x:0, y:0.20, z:0.10}, normal, 0);
					bar1[0] += (ox+xl);
					bar1[1] += (oy+yl);
					bar1[2] += (o.z+zl);
					bars1.push(bar1);

					var bar2 = AxisAngleTransform({x:0, y:-0.20, z:0.10}, normal, 0);
					bar2[0] += (ox+xl);
					bar2[1] += (oy+yl);
					bar2[2] += (o.z+zl);
					bars2.push(bar2);

					if (tricount%4 == 2) {
						var temp = [AxisAngleTransform({x:0, y:0.05, z:0.05}, normal, 0), bar1, AxisAngleTransform({x:0, y:0.05, z:-0.05}, normal, 0)];
						var temp2 = [AxisAngleTransform({x:0, y:-0.05, z:0.05}, normal, 0), bar2, AxisAngleTransform({x:0, y:-0.05, z:-0.05}, normal, 0)];
						temp[0][0] += (ox+xl); temp[0][1] += (oy+yl); temp[0][2] += (o.z+zl);
						temp[2][0] += (ox+xl); temp[2][1] += (oy+yl); temp[2][2] += (o.z+zl);
						temp2[0][0] += (ox+xl); temp2[0][1] += (oy+yl); temp2[0][2] += (o.z+zl);
						temp2[2][0] += (ox+xl); temp2[2][1] += (oy+yl); temp2[2][2] += (o.z+zl);
						if (bar1.x+bar1.y > bar2.x+bar2.y) {
							tris.push(temp2);
							tris2.push(temp);
						} else {
							tris.push(temp);
							tris2.push(temp2);							
						}
					}	

				}
				var cx = 400+(xl+ox)*40-(yl+oy)*40
				var cy = ((xl+ox)+(yl+oy))*20
				if (started) sCtx.lineTo(cx, 2*cy);
				else { sCtx.moveTo(cx, 2*cy); started = true; }
				d += 0.1;
				px = ox+xl; py = oy+yl; pz = o.z+zl;
			}
			d -= piece.span;
			xl += piece.finalo.x*costd-piece.finalo.y*sintd;
			yl += piece.finalo.y*costd+piece.finalo.x*sintd;
			zl += piece.finalo.z;
			zl = Math.round(zl*3)/3;
			trackdir = (trackdir + piece.rotchange)&3;
			costd = Math.round(Math.cos(trackdir*(Math.PI/2)));
			sintd = Math.round(Math.sin(trackdir*(Math.PI/2)));
			trackpiece++;

		}
			bars1.push(-1);
			bars2.push(-1);
		}

			sCtx.strokeStyle = "#000000"
			sCtx.lineWidth = 7;
			sCtx.stroke();
			sCtx.beginPath();

			drawbars(bars1);
			drawbars(bars2);

			function drawbars(bars) {
				var flag = true;
				for (var b=0;b<bars.length;b++) {
					if (bars[b] == -1) {flag = true; continue;};
					var cx = 400+bars[b][0]*40-bars[b][1]*40
					var cy = (bars[b][0]+bars[b][1])*20
					if (flag) { sCtx.moveTo(cx, cy*2); flag = false }
					else sCtx.lineTo(cx, cy*2);
				//alert(cx);
				}
			}

			sCtx.strokeStyle = "#000000"
			sCtx.lineWidth = 4;
			sCtx.stroke();

			sCtx.lineWidth = 1;
			sCtx.fillStyle = "#000000"
			sCtx.strokeStyle = "#000000"

			function tridraw(tris) {
			for (var t=1;t<tris.length;t++) {
				sCtx.beginPath();
				for (var p=0;p<4;p++) {
					var item = tris[t][p%3];
					var cx = 400+item[0]*40-item[1]*40
					var cy = (item[0]+item[1])*20
					if (p == 0) { sCtx.moveTo(cx, cy*2);}
					else sCtx.lineTo(cx, cy*2);
				}
				sCtx.fill();
				sCtx.stroke();
			}
			}

			tridraw(tris);
			tridraw(tris2);
		
	}

	function drawUIPiece(piecen, trackdir) { //backup realtime track drawer

		pCtx.beginPath();
		pCtx.clearRect(0,0,180,180);

		if (piecen == -1) {
			pCtx.strokeStyle = "#000000"
			pCtx.lineWidth = 6;				
			pCtx.lineCap = "round";
			var meas = pCtx.measureText("Invalid Piece");
			pCtx.globalAlpha = 0.6;
			pCtx.strokeText("Invalid Piece", 90-meas.width/2, 160);
			pCtx.globalAlpha = 1;
			pCtx.fillText("Invalid Piece", 90-meas.width/2, 160);
			return;
		}

		var bars1 = [];
		var bars2 = [];
		var tris = [];
		var tris2 = [];
		var tricount = 0;

		costd = Math.cos(trackdir*(Math.PI/2));
		sintd = Math.sin(trackdir*(Math.PI/2))

		var piece = trackpieces[piecen];
		var d = 0;
		var xl=(0-(piece.size.x-1)/2)*costd-(0-(piece.size.y-1)/2)*sintd
		var yl=(0-(piece.size.y-1)/2)*costd+(0-(piece.size.x-1)/2)*sintd
		var zl=0-(piece.size.z-1)/6

		switch (trackdir) {
			case 1:
			xl++;
			break;
			case 2:
			xl++;
			yl++;
			break;
			case 3:
			yl++;
			break;
		}
		//var trackdir = 0;

		var px = null, py = null, pz = null
		var started = false;


			while (d < piece.span) {
				var o = piece.offsets(d);
				var ox = o.x*costd-o.y*sintd;
				var oy = o.y*costd+o.x*sintd;
				tricount++;

				if (px != null) {
					var mag = Math.sqrt(Math.pow(((ox+xl)-px), 2)+Math.pow(((oy+yl)-py), 2)+Math.pow(((o.z+zl)-pz), 2));
					var normal = {x:((ox+xl)-px)/mag, y:((oy+yl)-py)/mag, z:((o.z+zl)-pz)/mag};

					var bar1 = AxisAngleTransform({x:0, y:0.20, z:0.10}, normal, 0);
					bar1[0] += (ox+xl);
					bar1[1] += (oy+yl);
					bar1[2] += (o.z+zl);
					bars1.push(bar1);

					var bar2 = AxisAngleTransform({x:0, y:-0.20, z:0.10}, normal, 0);
					bar2[0] += (ox+xl);
					bar2[1] += (oy+yl);
					bar2[2] += (o.z+zl);
					bars2.push(bar2);

					if (tricount%4 == 2) {
						var temp = [AxisAngleTransform({x:0, y:0.05, z:0.05}, normal, 0), bar1, AxisAngleTransform({x:0, y:0.05, z:-0.05}, normal, 0)];
						var temp2 = [AxisAngleTransform({x:0, y:-0.05, z:0.05}, normal, 0), bar2, AxisAngleTransform({x:0, y:-0.05, z:-0.05}, normal, 0)];
						temp[0][0] += (ox+xl); temp[0][1] += (oy+yl); temp[0][2] += (o.z+zl);
						temp[2][0] += (ox+xl); temp[2][1] += (oy+yl); temp[2][2] += (o.z+zl);
						temp2[0][0] += (ox+xl); temp2[0][1] += (oy+yl); temp2[0][2] += (o.z+zl);
						temp2[2][0] += (ox+xl); temp2[2][1] += (oy+yl); temp2[2][2] += (o.z+zl);
						if (bar1.x+bar1.y > bar2.x+bar2.y) {
							tris.push(temp2);
							tris2.push(temp);
						} else {
							tris.push(temp);
							tris2.push(temp2);							
						}
					}	

				}
				var cx = 90+(xl+ox)*40-(yl+oy)*40
				var cy = ((xl+ox)+(yl+oy))*20-(zl+o.z)*60+80
				if (started) pCtx.lineTo(cx, cy);
				else { pCtx.moveTo(cx, cy); started = true; }
				d += 0.1;
				px = ox+xl; py = oy+yl; pz = o.z+zl;
			}

			bars1.push(-1);
			bars2.push(-1);

			pCtx.strokeStyle = "#000000"
			pCtx.lineWidth = 7;
			pCtx.stroke();
			pCtx.strokeStyle = "#FFFFFF"
			pCtx.lineWidth = 5;
			pCtx.stroke();
			pCtx.beginPath();

			pCtx.lineWidth = 1;
			pCtx.fillStyle = "#FFFFFF"
			pCtx.strokeStyle = "#000000"

			function tridraw(tris) {
			for (var t=1;t<tris.length;t++) {
				pCtx.beginPath();
				for (var p=0;p<4;p++) {
					var item = tris[t][p%3];
					var cx = 90+item[0]*40-item[1]*40
					var cy = (item[0]+item[1])*20-item[2]*60+80
					if (p == 0) { pCtx.moveTo(cx, cy);}
					else pCtx.lineTo(cx, cy);
				}
				pCtx.fill();
				pCtx.stroke();
			}
			}

			tridraw(tris);
			tridraw(tris2);

			drawbars(bars1);
			drawbars(bars2);

			function drawbars(bars) {
				var flag = true;
				for (var b=0;b<bars.length;b++) {
					if (bars[b] == -1) {flag = true; continue;};
					var cx = 90+bars[b][0]*40-bars[b][1]*40
					var cy = (bars[b][0]+bars[b][1])*20-bars[b][2]*60+80
					if (flag) { pCtx.moveTo(cx, cy); flag = false }
					else pCtx.lineTo(cx, cy);
				//alert(cx);
				}
			}

			pCtx.strokeStyle = "#000000"
			pCtx.lineWidth = 4;
			pCtx.stroke();
			pCtx.strokeStyle = "#FFFFFF"
			pCtx.lineWidth = 2;
			pCtx.stroke();


		pCtx.beginPath();
		pCtx.strokeStyle = "#000000"
		pCtx.lineWidth = 6;				
		pCtx.lineCap = "round";
		var meas = pCtx.measureText(pieceNames[piecen]);
		pCtx.globalAlpha = 0.6;
		pCtx.strokeText(pieceNames[piecen], 90-meas.width/2, 160);
		pCtx.globalAlpha = 1;
		pCtx.fillText(pieceNames[piecen], 90-meas.width/2, 160);
		pCtx.lineCap = "butt";
	}

	function checkClosestCollider(cx, cy, cz, error, exempt) {
		var exempt = exempt || -1;
		var error = error * error

		var closestDistance = 255;
		var closestDistanceAt = [-1, -1, 0];

		for (var i = 0; i < tracks.length; i++) {

			if (i == exempt) continue;

			var track = tracks[i].pieces;
			var trackpiece = 0;
			var d = 0;
			var xl = tracks[i].startpos.x;
			var yl = tracks[i].startpos.y;
			var zl = tracks[i].startpos.z;
			var trackdir = tracks[i].startrot;
			costd = Math.round(Math.cos(trackdir * (Math.PI / 2)));
			sintd = Math.round(Math.sin(trackdir * (Math.PI / 2)));
			var o, ox, oy;

			while (trackpiece < track.length) {
				var piece = trackpieces[track[trackpiece]];
				while (d < piece.span) {
					var o = piece.offsets(d);
					var ox = o.x * costd - o.y * sintd;
					var oy = o.y * costd + o.x * sintd;
					var dist = (cx - xl - ox) * (cx - xl - ox) + (cy - yl - oy) * (cy - yl - oy) + (cz - zl - o.z) * (cz - zl - o.z);
					if ((dist < error) && (dist < closestDistance)) {
						closestDistance = dist;
						var oz = o.z;
						var p = piece.offsets(d + 0.01); //get a really close position to get the gradient so we can dot that against mid air velocity
						var px = p.x * costd - p.y * sintd;
						var py = p.y * costd + p.x * sintd;
						var mag = Math.sqrt((px - ox) * (px - ox) + (py - oy) * (py - oy) + (p.z - oz) * (p.z - oz));
						closestDistanceAt = [trackpiece, i, d, ((px - ox) / mag), ((py - oy) / mag), ((p.z - oz) / mag)];
					}
					d += 0.1;
				}
				d -= piece.span;
				xl += piece.finalo.x * costd - piece.finalo.y * sintd;
				yl += piece.finalo.y * costd + piece.finalo.x * sintd;
				zl += piece.finalo.z;
				zl = Math.round(zl*3)/3
				trackdir = (trackdir + piece.rotchange) & 3;
				costd = Math.round(Math.cos(trackdir * (Math.PI / 2)));
				sintd = Math.round(Math.sin(trackdir * (Math.PI / 2)));
				trackpiece++;
			}
		}
		return closestDistanceAt;
	}

}
window.addEventListener("load", function(evt) {
	game = new ld26game(document.getElementById("game"))
}, false);