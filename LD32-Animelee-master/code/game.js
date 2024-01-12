//game.js

var AudioContext = window.AudioContext || window.webkitAudioContext || window.MozAudioContext;

function game(canvas) {
	var t = this;

	t.ctx = canvas.getContext("2d");
	t.ctx.canvas = canvas;
	t.canvas = canvas;
	t.ac = new AudioContext();
	t.outGain = t.ac.createGain();
	t.outGain.connect(t.ac.destination);

	t.mouseX = 0;
	t.mouseY = 0;
	t.mouseDown = false;
	t.keyDownArray = new Array(256);
	t.musicMute = false;
	t.allMute = false;

	document.body.addEventListener("mousemove", getMousePos);
	document.body.addEventListener("mousedown", MouseDown);
	document.body.addEventListener("mouseup", MouseUp);

	document.body.addEventListener("keydown", KeyDown);
	document.body.addEventListener("keyup", KeyUp);

	var lastFrame = Date.now();
	var behind = 0;

	// LOADER LOGIC

	var fileNames = [
		"collision/lvl1.svg",
		"img/lvl1.png",

		"img/player.png",
		"img/playerm.png",
		"img/playerf.png",

		"img/Croc.png",
		"img/Phoebe.png",
		"img/Whale.png",
		"img/Cat.png",
		"img/Snake.png",
		"img/bg.png",
		"img/itemSpawn.png",
		"img/itemSpawnIna.png",
		"img/cog.png",
		"img/halfcog.png",

		"sound/death_lb.wav",
		"sound/impact_lb.wav",
		"sound/jump_lb.wav",
		"sound/pickup_lb.wav",
		"sound/walljump_lb.wav",
		"sound/respawn_lb.wav",
		"sound/music.ogg",
		"sound/roundEnd.ogg",
	]
	var fileTypes = [
		"document",
		"image",

		"image",
		"image",
		"image",

		"image",
		"image",
		"image",
		"image",
		"image",
		"image",
		"image",
		"image",
		"image",
		"image",

		"sound",
		"sound",
		"sound",
		"sound",
		"sound",
		"sound",
		"sound",
		"sound"
	]

	var files = {}; //map from filename -> file
	t.files = files;
	var totalFiles = fileNames.length;
	var loadedFiles = 0;
	var mainScene;

	load();

	function load() {
		for (var i=0; i<totalFiles; i++) {
			switch (fileTypes[i]) {
				case "image":
					loadImg(fileNames[i]);
					break;
				case "sound":
					loadSound(fileNames[i]);
					break;
				default: //fileType supplies the responsetype for an xmlhttprequest
					loadFile(fileNames[i], fileTypes[i]);
					break;
			}
		}
	}

	function fileLoaded() {
		if (++loadedFiles == totalFiles) init();
	}

	function loadImg(url) {
		var img = new Image();
		img.src = url;
		img.onload = function() {
			files[url] = img;
			fileLoaded();
		}
	}

	function loadSound(url, name) {
		var name = name;
		if (name == null) name = url; 
		var xml = new XMLHttpRequest();
		xml.open("GET", url, true);
		xml.responseType = "arraybuffer";

		xml.onload = function() {
			t.ac.decodeAudioData(xml.response, function(buffer) {
				files[name] = buffer;
				fileLoaded();
			}, function(){
				loadSound(url.substr(0, url.length-3)+"wav", url); //retry as wav
			});
		}
		xml.send();
	}

	function loadFile(url, type) {
		var xml = new XMLHttpRequest();
		xml.open("GET", url);
		xml.responseType = type;
		xml.onload = function() {
			files[url] = xml.response;
			fileLoaded();
		}
		xml.send();
	}

	// GAME LOGIC

	function init() {
		mainScene = new clientScene(t);
		tick();
	}

	var lagMode = false;
	var lowLagFrames = 0;

	function tick() {
		if (canvas.clientHeight != canvas.height) canvas.height = canvas.clientHeight;
		if (canvas.clientWidth != canvas.width) canvas.width = canvas.clientWidth;

		behind += Date.now() - lastFrame;
		lastFrame = Date.now();

		if (!lagMode) {
			var lagFrames = 0;
			while (behind > 1000/60) {
				behind -= 1000/60;

				mainScene.update();

				var frameTime = Date.now() - lastFrame;
				if (frameTime>14) lagFrames++;
				behind += frameTime;
				lastFrame = Date.now();
				if (lagFrames > 5) {
					if (mainScene.child != null && !mainScene.child.fastRope) mainScene.child.fastRope = true; 
					else lagMode = true;
					break;
				}
			}
		} else {
			behind = 0;
			mainScene.update();
			mainScene.update();
			mainScene.update();
			//force 20fps
			var frameTime = Date.now() - lastFrame;
			if (frameTime<13*3) lowLagFrames++;
			else lowLagFrames = 0;
			if (lowLagFrames > 10) lagMode = false;
		}

		mainScene.render(t.ctx);

		requestAnimationFrame(tick);
	}

	function getMousePos(evt) {
		t.mouseX = evt.pageX;
		t.mouseY = evt.pageY;
	}

	function MouseDown(evt) {
		t.mouseDown = true;
	}

	function MouseUp(evt) {
		t.mouseDown = false;
	}

	function KeyDown(evt) {
		evt.preventDefault();
		/*if (evt.keyCode == 9 || evt.keyCode == 8) {
			evt.preventDefault();
		}*/
		t.keyDownArray[evt.keyCode] = true;
	}

	function KeyUp(evt) {
		t.keyDownArray[evt.keyCode] = false;
	}
}