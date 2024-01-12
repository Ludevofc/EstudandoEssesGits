// my ludum dare game
// :')

window.fullscreen = function() {
	var elem = game.canvas
	if (elem.requestFullScreen != null) elem.requestFullScreen();
	else if (elem.webkitRequestFullScreen != null) elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	else if (elem.mozRequestFullScreen != null) elem.mozRequestFullScreen();
}


window.gogogogameee = function(canvas, rootdir) {
	var canvas = canvas;
	this.canvas = canvas;
	var ctx = canvas.getContext("2d");

	var scale = 2
	ctx.save();
	ctx.scale(2, 2); //game is at 2x scale

	function fixScaling() {
		if (typeof ctx.webkitImageSmoothingEnabled != "undefined") {
			ctx.webkitImageSmoothingEnabled = false;
		} else if (typeof ctx.mozImageSmoothingEnabled != "undefined") {
			ctx.mozImageSmoothingEnabled = false;
		} else {
			ctx.imageSmoothingEnabled = false;
		}
	}

	fixScaling();

	var GameAudioContext = null;
	var AudioAPI = true;
	if (typeof AudioContext !== 'undefined' && (typeof InstallTrigger == 'undefined')) { //if not firefox
		GameAudioContext = new AudioContext();
	} else if (typeof webkitAudioContext !== 'undefined') {
		GameAudioContext = new webkitAudioContext();
	} else {
		AudioAPI = false;
	}

	this.scopeEval = function(evalt) {
		return eval(evalt)
	}; //my favorite ever thing to do

	var sparkStates = [
		[255, 255, 255, 1],
		[255, 198, 0, 1],
		[254, 77, 1, 1],
		[153, 0, 0, 1],
		[0, 0, 0, 0]
	]

	var timerCycle = [
		[0, 153, 51],
		[255, 153, 0],
		[255, 51, 0],
		[153, 0, 0]
	]

	var deathMessages = [
		"really",
		"are you serious",
		"come on what was that",
		"what even are you",
		"you suck",
		"10 seconds not 10 hours dying",
		"stop wasting my time!!",
		"it's just some skeletons",
		"you're not very good at this",
		"try not running into things",
		"why",
		"what is this like the 20th time",
		"don't embarrass yourself any more"
	]

	var animations = {
		playerIdle: {
			frames: [
				"player/idle0.png", "player/idle1.png"
			],
			playbackRate: 20 //takes 20 frames to advance one animation frame
		},
		playerRun: {
			frames: [
				"player/run0.png", "player/run1.png", "player/run2.png", "player/run3.png", "player/run4.png"
			],
			playbackRate: 1 //takes 1 frame to advance one animation frame
		},
		playerWin: {
			frames: [
				"player/win.png"
			],
			playbackRate: 1 //takes 1 frame to advance one animation frame
		},
		playerRocket: {
			frames: [
				"player/ro0.png", "player/ro1.png", "player/ro2.png", "player/ro3.png"
			],
			playbackRate: 3 //takes 3 frames to advance one animation frame
		},
		playerWall: {
			frames: [
				"player/wall.png",
			],
			playbackRate: 1 //takes 1 frame to advance one animation frame
		},
		SkeletonWalk: {
			frames: [
				"en/skele/run0.png", "en/skele/run1.png", "en/skele/run2.png", "en/skele/run3.png"
			],
			playbackRate: 4 //takes 4 frames to advance one animation frame
		}
	}

	var animObjs = []

	var soundsrc = [
		"sounds/jump.wav", "sounds/start.wav", "sounds/step0.wav", "sounds/step1.wav", "sounds/wall.wav", "sounds/death.wav", "sounds/shoot.wav", "sounds/explode1.wav", "sounds/levelmusic.wav",  
		"sounds/levelstart.wav", "sounds/win.wav", "sounds/nice.wav", "sounds/chest.wav", "sounds/blast.wav"
	]

	var levelsrc = [
		"levels/level1.oel", "levels/level3.oel", "levels/test.oel", "levels/level2.oel"
	]
	var imgsrc = [
		"tileset/tiles2.png", "player/idle0.png", "player/idle1.png", "player/run0.png", "player/run1.png", "player/run2.png", "player/run3.png", "player/run4.png", "en/skele/run0.png",
		"en/skele/run1.png", "en/skele/run2.png", "en/skele/run3.png", "player/wall.png", "p/s0.png", "p/s1.png", "p/s2.png", "p/s3.png", "p/s4.png", "p/s5.png", "p/r0.png", "p/r1.png", 
		"p/r2.png", "p/r3.png", "p/r4.png", "en/chest/closed.png", "en/chest/open.png", "cross.png", "p/rocket.png", "en/ped/gem0.png", "en/ped/gem1.png", "en/ped/gem2.png", "en/ped/gem3.png", 
		"en/ped/ped.png", "player/win.png", "player/ro0.png", "player/ro1.png", "player/ro2.png", "player/ro3.png", 
	]
	var tilesets = {
		NewTileset0: "tileset/tiles2.png"
	}

	var rockets = []

	var framebuf = 0;
	var images = {};
	var sounds = {};
	var levels = [];
	var particles = [];
	var level, cameraX, cameraY, player, hitfloor, enemies, dead, deathMessage, rocketPress = false, totalChests, activeChests, musicGain, showNoTreasure = false, levelOver;
	var keysArray = new Array(256);
	var jumpPressed = false;
	var crossHairRot = 0;
	var crosshair = -1;
	var timer = 10;
	var fullscreened = false;
	var counterScale = 1;
	var score = 0;
	var scoreAsOfLS = 0;
	var levelOverTime = 0;
	var levelStartTime = 0;
	var LeveloverYs = [];

	var totalFiles = levelsrc.length + imgsrc.length + soundsrc.length;
	var loadedFiles = 0;

	for (var i = 0; i < levelsrc.length; i++) {
		loadLevel(i);
	}
	for (var i = 0; i < imgsrc.length; i++) {
		loadImage(imgsrc[i]);
	}
	for (var i = 0; i < soundsrc.length; i++) {
		loadSound(soundsrc[i]);
	}

	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);

	function keyDownHandler(evt) {
		if ((evt.keyCode == 38) && !(keysArray[evt.keyCode])) jumpPressed = 0;
		if ((evt.keyCode == 88) && !(keysArray[evt.keyCode])) rocketPress = true;
		keysArray[evt.keyCode] = true;
	}

	function keyUpHandler(evt) {
		keysArray[evt.keyCode] = false;
	}

	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;

	var enemyScripts = {}
	var enemyInit = {}

	function playSound(audio) {
		if (AudioAPI) {
			var volume = volume || 1;
			var buf = GameAudioContext.createBufferSource();
			buf.buffer = audio;
			buf.connect(GameAudioContext.destination);
			buf.start(0);
		} else {
			audio.currentTime = 0;
			audio.volume = 1;
			audio.play();
		}
	}

	function playMusic(audio) {
		if (AudioAPI) {
			var buf = GameAudioContext.createBufferSource();
			buf.buffer = audio;
			musicGain = GameAudioContext.createGain();
			musicGain.gain.value = 1;
			buf.connect(musicGain);
			musicGain.connect(GameAudioContext.destination);
			buf.start(0);
		} else {
			playSound(audio);
		}
	}

	function colPoints(x, y, ox1, oy1, width, height) {
		return (apcst(x+ox1, y+oy1) || apcst(x+ox1+width, y+oy1) || apcst(x+ox1+width, y+oy1+height) || apcst(x+ox1, y+oy1+height))
	}

	function boxColPlayer(x, y, ox1, oy1, width, height) {
		return !(player.x > x+width || player.x+8 < x || player.y > y+height || player.y+12 < y)
	}

	function closestEnemy() {
		var minDistance = 125;
		var target = -1;
		for (var i=0; i<enemies.length; i++) {
			var obj = enemies[i];
			if (!(obj.alive)) continue;
			if (!((obj.type == "Chest") || (obj.type == "Gem") || (obj.type == "Pedestal"))) {
				var calc = Math.sqrt(Math.pow(obj.x-player.x, 2) + Math.pow(obj.y-player.y, 2));
				if (calc < minDistance) { target = i; minDistance = calc; }
			}
		}
		return target;
	}

	function addRocket(x, y, xv, yv, target) {
		rockets.push({
			x: x,
			y: y,
			xv: xv,
			yv: yv,
			target: target,
			angle: 0
		})
	}

	function rocketExplode(id) {
		var obj = rockets[id];

		addParticle(obj.x, obj.y, 33, 1/15, "explosion", 15, "#FFFFFF")
		for (var i=0; i<20; i++){
			setTimeout(function(){randomRExplosion(obj.x, obj.y)}, 16*i)
		}

		for (var i=0; i<enemies.length; i++) {
			var obje = enemies[i];
			if (!(obje.alive)) continue;
			if (obje.type != "Chest") {
				var calc = Math.sqrt(Math.pow(obje.x-obj.x, 2) + Math.pow(obje.y-obj.y, 2));
				if (calc < 33) {
					if (obje.type == "Skeleton") skeleDeath(obje);
				}
			}
		}
		playSound(sounds["sounds/explode1.wav"]);

		rockets.splice(id, 1)
	}

	function randomRExplosion(x, y) {
		var rC = sparkStates[Math.floor((Math.random()*4))]
		addParticle(x+(Math.random()-0.5)*50, y+(Math.random()-0.5)*50, (Math.random()*12)+7, 1/15, "explosion", 15, "rgb("+rC[0]+", "+rC[1]+", "+rC[2]+")")
	}

	function updateRockets() {
		for (var i=0; i<rockets.length; i++) {
			var obj = rockets[i];
			var targ = enemies[obj.target];
			var img = images[targ.anim.frame]
			var xdist = (targ.x+img.width/2)-obj.x
			var ydist = (targ.y+img.height/2)-obj.y
			obj.angle = Math.atan2(ydist, xdist)+(Math.PI/2)
			obj.xv += Math.sin(obj.angle);
			obj.yv -= Math.cos(obj.angle);
			obj.xv *= 0.92;
			obj.yv *= 0.92;
			
			obj.x += obj.xv;
			obj.y += obj.yv;
			if (apcst(obj.x, obj.y)) { rocketExplode(i--); continue; }
			for (var j=0; j<enemies.length; j++) {
				if (checkPointForEnemy(obj.x, obj.y, targ)) { rocketExplode(i--); break; }
			}
		}
	}

	function checkPointForEnemy(x, y, enemy) {
		var img = images[enemy.anim.frame]
		return (x>enemy.x && y>enemy.y && x<enemy.x+img.width && y<enemy.y+img.height)
	}

	enemyScripts["Skeleton"] = function(enemy) {
		enemy.xv = enemy.facing*2
		enemy.x += enemy.xv;
		if (colPoints(enemy.x, enemy.y, 5, 1, 9, 20)) {
			enemy.x -= enemy.xv;
			enemy.facing = -enemy.facing;
		}

		enemy.y += enemy.yv;
		if (colPoints(enemy.x, enemy.y, 5, 1, 9, 20)) {
			enemy.y -= enemy.yv;
			enemy.yv = enemy.yv*-0.33;
		}

		enemy.yv += 0.2;

		if (!(apcst(enemy.x+9+enemy.facing*10, enemy.y+25))) {
			enemy.facing = -enemy.facing;
		}

		if (boxColPlayer(enemy.x, enemy.y, 5, 1, 9, 20)) {
			if (dead == -1 && !levelOver) {
				playerDeath();
			}
		}
	}

	enemyScripts["Chest"] = function(enemy) {
		enemy.yv += 0.2;
		enemy.y += enemy.yv;
		if (colPoints(enemy.x, enemy.y, 0, 0, 27, 20)) {
			enemy.y -= enemy.yv;
			enemy.yv = enemy.yv*-0.5;
		}

		if (boxColPlayer(enemy.x, enemy.y, -5, -5, 37, 30)) {
			if (!(enemy.triggered)) {
				enemy.triggered = true;
				enemy.anim.frame = "en/chest/open.png";
				score += 325;
				activeChests += 1;
				playSound(sounds["sounds/chest.wav"]);
			}
		}
	}

	enemyScripts["Gem"] = function(enemy) {
	}

	enemyScripts["Pedestal"] = function(enemy) {
		enemy.gemFloat += 0.05;
		if (!levelOver) {
			enemy.gem.y = enemy.y - 2 + Math.sin(enemy.gemFloat)*3;
			enemy.gem.x = enemy.x + 6.5;
		}
		if (boxColPlayer(enemy.x, enemy.y, 0, 0, 40, 44)) {
			if (!levelOver) {
				if (totalChests != activeChests) showNoTreasure = true;
				else {
					if (AudioAPI) musicGain.gain.value = 0;
					else sounds["sounds/levelmusic.wav"].volume = 0;
					playSound(sounds["sounds/win.wav"]);
					levelOver = true;
					player.Pedestal = enemy
					player.Gem = enemy.gem
				}
			}
		} else {
			showNoTreasure = false;
		}
	}

	enemyInit["Gem"] = function(enemy) {
		enemy.alive = true;
	}

	enemyInit["Skeleton"] = function(enemy) {
		enemy.anim = new animation();
		enemy.anim.setAnim("SkeletonWalk");
		enemy.xv = 0;
		enemy.yv = 0;
		enemy.facing = 1;
		enemy.y -= 6;
		enemy.x = Number(enemy.x);
		enemy.alive = true;
	}

	enemyInit["Pedestal"] = function(enemy) {
		enemy.anim = {frame: "en/ped/ped.png"}
		enemy.y -= 28;
		enemy.x = Number(enemy.x);
		enemy.alive = true;
		enemy.gem = findObjWithProperty(enemies, "type", "Gem")
		enemy.gem.anim = {frame: "en/ped/gem"+level+".png"}
		enemy.gemFloat = 0;
	}

	enemyInit["Chest"] = function(enemy) {
		totalChests += 1;
		enemy.anim = {frame: "en/chest/closed.png"} //static, just need fake anim obj
		enemy.yv = 0;
		enemy.facing = 1;
		enemy.y -= 6;
		enemy.x = Number(enemy.x);
		enemy.alive = true;
		enemy.triggered = false;
	}

	function loadLevel(num) {
		var req = new XMLHttpRequest();
		req.open("GET", levelsrc[num]);
		req.responseType = "text";
		req.send();
		req.onreadystatechange = function() {
			if (this.readyState == this.DONE) {
				var parser = new DOMParser();
				var doc = parser.parseFromString(this.response, "application/xml");
				var level = doc.getElementsByTagName("level")[0]
				var tiles = level.getElementsByTagName("Tiles")[0]
				var leveldata = tiles.childNodes[0].nodeValue.replace(/\n/g, ',')
				levels[num] = {
					width: level.getAttribute("width") / 16,
					height: level.getAttribute("height") / 16,
					tileset: tiles.getAttribute("tileset"),
					data: leveldata.split(","),
					enemies: [],
					special: []
				}

				var enemies = level.getElementsByTagName("Enemies")[0]
				levels[num].enemies = GenerateOgmoEntityArray(enemies);

				var special = level.getElementsByTagName("SpecialStuff")[0]
				levels[num].special = GenerateOgmoEntityArray(special);

				fileLoaded();
			}
		}
	}

	function GenerateOgmoEntityArray(xml) {
		var array = []
		for (var i=0; i<xml.childNodes.length; i++) {
			var obj = xml.childNodes[i]
			if (obj.tagName != null) {
				array.push({type: obj.tagName, id: obj.getAttribute("id"), x: obj.getAttribute("x"), y: obj.getAttribute("y")})
			}
		}
		return array;
	}

	function findObjWithProperty(array, property, value) {
		for (var i=0; i<array.length; i++) {
			if (array[i][property] == value) return array[i];
		}
	}

	function animation() {
		this.frameNum = 0;
		this.animation = "";
		this.frame = "";
		var me = this
		this.remove = function() {
			animObjs.splice(animObjs.indexOf(me), 1);
		}
		this.setAnim = function(anim) {
			if (anim == this.animation) return;
			this.frameNum = 0;
			this.animation = anim;
			this.frame = animations[anim].frames[0]
		}
		animObjs.push(this);
	}

	function loadImage(src) {
		images[src] = new Image();
		images[src].src = src;
		images[src].onload = fileLoaded;
	}

	function loadSound(src) {
		if (AudioAPI) {
			var req = new XMLHttpRequest();
			req.open("GET", src);
			req.send();
			req.responseType = 'arraybuffer';
			req.onreadystatechange = function() {
				if (this.readyState == this.DONE) {
					try {
						GameAudioContext.decodeAudioData(this.response, function(buffer) {
								sounds[src] = buffer;
								fileLoaded();
							}, function(){alert("sound could not be read!")});
					} catch(err) {
						fileLoaded();
					}
				}
			}
		} else {
			sounds[src] = new Audio();
			sounds[src].src = src;
			sounds[src].oncanplaythrough = function(e) {
				fileLoaded();
			};
		}
	}

	function fileLoaded() {
		if (++loadedFiles == totalFiles) {
			init();
		} else {
			drawProgress();
		}
	}

	function drawProgress() {
		ctx.fillStyle = "#000000"
		ctx.fillRect(0, 0, canvas.width/scale, canvas.height/scale);

		ctx.fillStyle = "#FFFFFF"
		ctx.fillRect((canvas.width/2)/scale-25, (canvas.height/2)/scale-1.5, 50*(loadedFiles/totalFiles), 3);

		ctx.strokeStyle = "#FFFFFF"
		ctx.lineWidth = 0.5;
		ctx.strokeRect((canvas.width/2)/scale-25.75, (canvas.height/2)/scale-2.25, 51.5, 4.5);
		ctx.lineWidth = 1;
	}

	function init() {
		level = 0;
		setupLevel();
		window.requestAnimationFrame(render);
		prevFrame = Date.now();
	}

	function zeropad(value, number) {
		var value = value + ""
		while (value.length < number) {
			value = "0" + value;
		}
		return value;
	}

	function setupLevel() {
		LevelstartYs = [-75, 300];
		LeveloverYs = [300, 300, 300];
		score = scoreAsOfLS;
		var startObj = findObjWithProperty(levels[level].special, "type", "StartPoint")
		levelOver = false;
		cameraX = 0;
		cameraY = 0;
		player = {
			x: Number(startObj.x),
			y: Number(startObj.y),
			xv: 0,
			yv: 0,
			facing: 1
		}
		dead = -1;
		deathMessage = 0;
		enemies = JSON.parse(JSON.stringify(levels[level].enemies));

		totalChests = 0;
		activeChests = 0;
		levelOverTime = 0;
		initEnemies();

		hitfloor = 5;
		player.anim = new animation();
		player.anim.setAnim("playerIdle");
		if (levelStartTime>150) {
			playSound(sounds["sounds/start.wav"]);
			playMusic(sounds["sounds/levelmusic.wav"])
		} else {
			playSound(sounds["sounds/levelstart.wav"]);
		}
		timer = 10;
		rocketPress = false;
	}

	function render() {
		framebuf += Date.now()-prevFrame;
		prevFrame = Date.now();
		if (document.fullscreenElement != null || document.webkitFullscreenElement != null || ((typeof fullScreen != "undefined") && (fullScreen == true))) {
			if ((canvas.width != document.body.clientWidth) || (canvas.height != document.body.clientHeight)) {
				canvas.width = document.body.clientWidth;
				canvas.height = document.body.clientHeight;
				fullscreened = true;
				ctx.restore();
				ctx.save();
				scale = canvas.height/300;
				ctx.scale(scale, scale)
				fixScaling();
			}
		} else {
			if (fullscreened) {
				canvas.width = 800;
				canvas.height = 600;
				fullscreened = false;
				ctx.restore();
				ctx.save();
				scale = 2;
				ctx.scale(scale, scale);
				fixScaling();
			}
		}

		while (framebuf >= 1000/60) {
			update();
			framebuf -= 1000/60
		}
		ctx.fillStyle = "#00002E"
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		drawLevel();

		renderParticles();
		renderEnemies();

		renderRockets();

		if (dead == -1 && (levelStartTime>150)) {
			ctx.save();
			ctx.translate((player.x - cameraX)+4, (player.y - cameraY)+7.5)
			ctx.scale(player.facing, 1)
			ctx.drawImage(images[player.anim.frame], -6, -10);
			ctx.restore();
		}

		if (dead > 90) {
			ctx.font = "15pt Arial";
			var txtlength = ctx.measureText(deathMessages[deathMessage]).width
			ctx.fillStyle = "#FFFFFF";
			ctx.strokeStyle = "#000000";
			ctx.lineWidth = 6;
			ctx.strokeText(deathMessages[deathMessage], (canvas.width/(2*scale))-txtlength/2, 250);
			ctx.fillText(deathMessages[deathMessage], (canvas.width/(2*scale))-txtlength/2, 250);
			ctx.lineWidth = 1;
		}

		if (showNoTreasure) {
			ctx.font = "46px Gill Sans MT, Gill Sans, sans-serif";
			var txtlength = ctx.measureText("NOT ENOUGH").width
			ctx.fillStyle = "#FF8000";
			ctx.strokeStyle = "#000000";
			ctx.globalAlpha = 0.66;
			ctx.lineWidth = 5;
			ctx.strokeText("NOT ENOUGH", (canvas.width/(2*scale))-txtlength/2+4, 134);
			ctx.globalAlpha = 1;
			
			ctx.strokeStyle = "#FFFFFF";
			ctx.strokeText("NOT ENOUGH", (canvas.width/(2*scale))-txtlength/2, 130);
			ctx.fillText("NOT ENOUGH", (canvas.width/(2*scale))-txtlength/2, 130);

			ctx.strokeStyle = "#000000";
			var txtlength = ctx.measureText("TREASURE IDIOT").width
			ctx.globalAlpha = 0.66;
			ctx.strokeText("TREASURE IDIOT", (canvas.width/(2*scale))-txtlength/2+4, 204);
			ctx.globalAlpha = 1;
			
			ctx.strokeStyle = "#FFFFFF";
			ctx.strokeText("TREASURE IDIOT", (canvas.width/(2*scale))-txtlength/2, 200);
			ctx.fillText("TREASURE IDIOT", (canvas.width/(2*scale))-txtlength/2, 200);
			ctx.lineWidth = 1;
		}

		drawCounter();
		drawTreasureCount();
		if (levelOver) renderPost();
		if (!(levelStartTime>150)) renderStart();

		window.requestAnimationFrame(render);
	}

	function drawCounter() {
		ctx.save();
		ctx.translate(canvas.width/scale-50, 50);
		ctx.save();
		ctx.scale(counterScale, counterScale);

		ctx.beginPath();
		ctx.arc(0, 0, 39, Math.PI/2, 2.5*Math.PI);
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fill();

		ctx.beginPath();
		ctx.arc(0, 0, 36, Math.PI/2, 2.5*Math.PI);
		ctx.fillStyle = "#FFFFFF";
		ctx.fill();

		var displayT = Math.ceil(timer*10)/10
		var sC = timerCycle[Math.floor((10-timer)/3.334)]
		var eC = timerCycle[Math.ceil((10-timer)/3.334)]
		var p = ((10-timer)/3.334)%1
		var colour = "rgb("+Math.round(sC[0]*(1-p)+eC[0]*p)+", "+Math.round(sC[1]*(1-p)+eC[1]*p)+", "+Math.round(sC[2]*(1-p)+eC[2]*p)+")";

		ctx.beginPath();
		ctx.arc(0, 0, 31, -0.5*Math.PI, ((timer*-2/10)-0.5)*Math.PI, true);
		ctx.fillStyle = colour;
		ctx.lineTo(0, 0);
		ctx.fill();

		ctx.font = "30px Gill Sans MT, Gill Sans, sans-serif"
		var txtlength = ctx.measureText(displayT).width
		ctx.fillStyle = colour;
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = 3;

		ctx.globalAlpha = 0.2;
		ctx.strokeText(displayT, (-txtlength/2)+2, 13);
		ctx.globalAlpha = 1;

		ctx.strokeStyle = "#FFFFFF";
		ctx.strokeText(displayT, -txtlength/2, 11);
		ctx.fillText(displayT, -txtlength/2, 11);

		ctx.restore();

		ctx.font = "25px Gill Sans MT, Gill Sans, sans-serif"
		ctx.lineWidth = 4;
		var scoreText = zeropad(score, 8);
		ctx.strokeStyle = "#000000";
		ctx.fillStyle = "#FFFFFF";
		var txtlength = ctx.measureText(scoreText).width
		ctx.globalAlpha = 0.75;
		ctx.strokeText(scoreText, 40-txtlength, 240)
		ctx.globalAlpha = 1;
		ctx.fillText(scoreText, 40-txtlength, 240)

		ctx.restore();

	}

	function drawTreasureCount() {
		ctx.save()
		ctx.scale(2, 2);
		ctx.beginPath();
		ctx.arc(18.75, 132.5, 15, 0, 2*Math.PI);
		ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
		ctx.fill();

		ctx.drawImage(images["en/chest/closed.png"], 18.75-11.5, 132.5-12);

		ctx.font = "10px Gill Sans MT, Gill Sans, sans-serif"
		ctx.lineWidth = 4;
		ctx.strokeStyle = "#000000";
		ctx.fillStyle = "#FFFFFF";
		ctx.globalAlpha = 0.75;
		ctx.strokeText(activeChests+"/"+totalChests+" chests", 37, 144)
		ctx.globalAlpha = 1;
		ctx.fillText(activeChests+"/"+totalChests+" chests", 37, 144)

		ctx.restore();
	}

	var apcst = advancedPointCollisionSystemTm;

	function playercol() {
		return (apcst(player.x, player.y) || apcst(player.x + 8, player.y) || apcst(player.x + 8, player.y + 12) || apcst(player.x, player.y + 12))
	}

	function skeleDeath(enemy) {
		for (var i=0; i<75; i++){
			var ang = Math.random()*Math.PI*2
			var power = 10*Math.random()
			addParticle(enemy.x+3, enemy.y+12, (Math.cos(ang)*power)+enemy.xv, (Math.sin(ang)*power)+enemy.yv, "image", 120, "p/s"+Math.floor(Math.random()*5.99)+".png", Math.random()/2)
		}
		enemy.alive = false;
		score += 200;
	}

	function playerDeath() {
		if (AudioAPI) musicGain.gain.value = 0;
		else sounds["sounds/levelmusic.wav"].volume = 0;
		playSound(sounds["sounds/death.wav"]);
		dead = 0;
		deathMessage = Math.floor(Math.random()*deathMessages.length);
		for (var i=0; i<500; i++){
			var ang = Math.random()*Math.PI*2
			var power = 15*Math.random()
			addParticle(player.x+3, player.y+12, (Math.cos(ang)*power)+player.xv, (Math.sin(ang)*power)+player.yv, "spark", 120)
		}
		for (var i=0; i<5; i++){
			var ang = Math.random()*Math.PI*2
			var power = 7*Math.random()
			addParticle(player.x+3, player.y+12, (Math.cos(ang)*power)+player.xv, (Math.sin(ang)*power)+player.yv, "image", 120, "p/r"+i+".png", Math.random()/2)
		}
		addParticle(player.x+3, player.y+12, 50, 1/20, "explosion", 20, "#FFFFFF")
		for (var i=0; i<30; i++){
			setTimeout(randomPExplosion, 16*i)
		}
		//vars are x, y, radius, percent per frame

	}

	function randomPExplosion() {
		var rC = sparkStates[Math.floor((Math.random()*4))]
		addParticle(player.x+3+(Math.random()-0.5)*100, player.y+12+(Math.random()-0.5)*100, (Math.random()*15)+10, 1/15, "explosion", 15, "rgb("+rC[0]+", "+rC[1]+", "+rC[2]+")")
	}

	function update() {
		if (dead != -1) {
			if (dead++ > 180) setupLevel();
		} else if (!levelOver && (levelStartTime > 150)) {

		var anim = "playerIdle"
		player.yv += 0.2;
		if (player.xv > 4.4) player.xv = 4.4;
		if (player.xv < -4.4) player.xv = -4.4;

		player.x += player.xv;

		if (playercol()) {
			player.x -= player.xv;
			player.xv = 0;
		}

		player.y += player.yv;
		if (playercol()) {
			var hitfloor = 0
			player.y -= player.yv;
			player.yv = 0;
			player.xv *= 0.8;
		} else {
			player.xv *= 0.93;
		}

		if (!(hitfloor<5)) { //check for wall kicks
			if (apcst(player.x+11, player.y) || apcst(player.x+11, player.y+12)) {
				anim = "playerWall";
				player.facing = 1;
				if (jumpPressed < 5) {
					player.yv = -5; 
					player.xv = -4.4;
					jumpPressed = 5;
					for (var i=0; i<200; i++){
						var ang = Math.random()*Math.PI*2
						var power = 8*Math.random()
						addParticle(player.x+8, player.y+6, (Math.cos(ang)*power)+player.xv, (Math.sin(ang)*power)+player.yv, "spark", 120)
					}
					addParticle(player.x+8, player.y+6, 8, 1/15, "explosion", 15, "#FFFFFF")
					playSound(sounds["sounds/wall.wav"]);
				} else {
					player.yv *= 0.8;
				}
			} else if (apcst(player.x-3, player.y) || apcst(player.x-3, player.y+12)) {
				anim = "playerWall";
				player.facing = -1;
				if (jumpPressed < 5) {
					player.yv = -5; 
					player.xv = 4.4;
					jumpPressed = 5;
					for (var i=0; i<200; i++){
						var ang = Math.random()*Math.PI*2
						var power = 8*Math.random()
						addParticle(player.x, player.y+6, (Math.cos(ang)*power)+player.xv, (Math.sin(ang)*power)+player.yv, "spark", 120)
					}
					addParticle(player.x, player.y+6, 8, 1/15, "explosion", 15, "#FFFFFF")
					playSound(sounds["sounds/wall.wav"]);
				} else {
					player.yv *= 0.8;
				}
			}
		}

		if ((hitfloor<5) && (jumpPressed < 5)) { 
			player.yv = -6; 
			jumpPressed = 5; 
			for (var i=0; i<200; i++){
				var ang = Math.random()*Math.PI*2
				var power = 8*Math.random()
				addParticle(player.x+3, player.y+12, (Math.cos(ang)*power)+player.xv, (Math.sin(ang)*power)+player.yv, "spark", 120)
			}
			addParticle(player.x+3, player.y+12, 6, 1/10, "explosion", 10, "#FFFFFF")
			playSound(sounds["sounds/jump.wav"]);
		} 
		if (keysArray[37]) {
			player.facing = -1;
			player.xv -= (hitfloor<5)?1.1:0.3;
			if (hitfloor == 0) { for (var i=0; i<5; i++) addParticle(player.x+8, player.y+12, player.xv*(-Math.random()), Math.random()*6-3, "spark", 120) }
			if (anim != "playerWall") anim = "playerRun";
			if ((Math.floor(player.anim.frameNum) == 1) && (hitfloor<5)) playSound(sounds["sounds/step"+Math.round(Math.random())+".wav"]);
		}
		if (keysArray[39]) { 
			player.facing = 1;
			player.xv += (hitfloor<5)?1.1:0.3;
			if (hitfloor == 0) { for (var i=0; i<5; i++) addParticle(player.x, player.y+12, player.xv*(-Math.random()), Math.random()*6-3, "spark", 120) }
			if (anim != "playerWall") anim = "playerRun";
			if ((Math.floor(player.anim.frameNum) == 1) && (hitfloor<5)) playSound(sounds["sounds/step"+Math.round(Math.random())+".wav"]);
		}
		hitfloor++;
		jumpPressed++

		player.anim.setAnim(anim)
		crosshair = closestEnemy();

		if (rocketPress && (crosshair != -1)) { addRocket(player.x+4, player.y+8, player.xv, player.yv, crosshair); playSound(sounds["sounds/shoot.wav"]);}
		rocketPress = false;

		if (keysArray[82]) playerDeath();

		} else if (levelOver) {
			if (levelOverTime < 90) {
				player.x += ((player.Pedestal.x+17)-player.x)/10
				player.y += ((player.Pedestal.y+3)-player.y)/10
				player.Gem.y += ((player.Pedestal.y-22)-player.Gem.y)/10
				player.yv = 0;
				player.anim.setAnim("playerWin");
			} else {
				player.anim.setAnim("playerRocket");
				player.yv -= 0.2;
				var before = apcst(player.x+4, player.y+6);
				player.y += player.yv;
				player.Gem.y += player.yv;
				var after = apcst(player.x+4, player.y+6);
				if (before != after) {
					var y = (before)?player.y:(player.y-player.yv)
					addParticle(player.x+3, player.y+6, 20, 1/15, "explosion", 15, "#FFFFFF")
					for (var i=0; i<200; i++){
						var ang = Math.random()*Math.PI*2
						var power = 8*Math.random()
						addParticle(player.x+3, y+6, (Math.cos(ang)*power), (Math.sin(ang)*power)+player.yv, "spark", 120)
					}
					playSound(sounds["sounds/explode1.wav"]);
				}
			}
			if (levelOverTime == 90) playSound(sounds["sounds/blast.wav"]);
			if (levelOverTime == 360) score += Math.ceil(timer*1000);
			if (levelOverTime == 420) {
				levelStartTime = 0;
				scoreAsOfLS = score;
				level++;
				if (level >= levels.length) { alert("You Win! Final Score: "+score); level--; levelStartTime = 255}
				else setupLevel();
			}
			if (levelOverTime == 250) playSound(sounds["sounds/nice.wav"])
			levelOverTime++;
		}

		cameraX += ((player.x + player.xv*0 - (canvas.width/2)/scale) - cameraX)/10
		cameraY += ((player.y + player.yv*0 - (canvas.height/2)/scale) - cameraY)/10

		moveParticles();
		processAnimations();
		updateEnemies();
		updateRockets();
		counterScale += ((1-counterScale)/10)
		var prevTimer = timer
		if (!levelOver && (levelStartTime>150)) timer -= 1/60;
		if (timer <= 0) {
			timer = 0
			if (dead == -1) playerDeath();
		}
		if (Math.floor(prevTimer) != Math.floor(timer)) counterScale = 1.5;
		levelStartTime++;
		if (levelStartTime == 150) {
			playSound(sounds["sounds/start.wav"]);
			playMusic(sounds["sounds/levelmusic.wav"]);
		}
		
	}

	function renderStart() {
		LevelstartYs[0] += (150-LevelstartYs[0])/10
		ctx.font = "54px Gill Sans MT, Gill Sans, sans-serif"
		ctx.fillStyle = "#009933"
		ctx.strokeStyle = "#FFFFFF"
		var txtlength = ctx.measureText("Level "+(level+1)).width
		ctx.lineWidth = 7;
		ctx.strokeText("Level "+(level+1), (canvas.width/2)/scale-txtlength/2, LevelstartYs[0]);
		ctx.fillText("Level "+(level+1), (canvas.width/2)/scale-txtlength/2, LevelstartYs[0]);

		if (levelStartTime > 80) {
			LevelstartYs[1] += (182-LevelstartYs[1])/10
			ctx.font = "25px Gill Sans MT, Gill Sans, sans-serif"
			ctx.fillStyle = "#FFFFFF"
			ctx.strokeStyle = "rgba(0, 0, 0, 0.8)"
			ctx.lineWidth = 3;
			var txtlength = ctx.measureText("Get Ready!").width
			ctx.strokeText("Get Ready!", (canvas.width/2)/scale-txtlength/2, LevelstartYs[1]);
			ctx.fillText("Get Ready!", (canvas.width/2)/scale-txtlength/2, LevelstartYs[1]);
		}

		ctx.lineWidth = 1;
	}


	function renderPost() {
		if (levelOverTime > 240) {
			LeveloverYs[0] += (134-LeveloverYs[0])/10
			ctx.font = "54px Gill Sans MT, Gill Sans, sans-serif"
			ctx.fillStyle = "#009933"
			ctx.strokeStyle = "#FFFFFF"
			var txtlength = ctx.measureText("Good Job!").width
			ctx.lineWidth = 7;
			ctx.strokeText("Good Job!", (canvas.width/2)/scale-txtlength/2, LeveloverYs[0]);
			ctx.fillText("Good Job!", (canvas.width/2)/scale-txtlength/2, LeveloverYs[0]);
			ctx.lineWidth = 1;
		}

		if (levelOverTime > 280) {
			LeveloverYs[1] += (177-LeveloverYs[1])/10
			ctx.font = "25px Gill Sans MT, Gill Sans, sans-serif"
			ctx.fillStyle = "#FFFFFF"
			var txt = "Leftover Time: "+Math.ceil(timer*1000)/1000+" seconds"
			var txtlength = ctx.measureText(txt).width
			ctx.fillText(txt, (canvas.width/2)/scale-txtlength/2, LeveloverYs[1]);
		}

		if (levelOverTime > 320) {
			LeveloverYs[2] += (200-LeveloverYs[2])/10
			ctx.font = "25px Gill Sans MT, Gill Sans, sans-serif"
			ctx.fillStyle = "#FFFFFF"
			var txt = "Bonus Points: "+Math.ceil(timer*1000)
			var txtlength = ctx.measureText(txt).width
			ctx.fillText(txt, (canvas.width/2)/scale-txtlength/2, LeveloverYs[2]);
		}

	}

	function updateEnemies() {
		for (var i=0; i<enemies.length; i++) {
			if (!(enemies[i].alive)) continue;
			enemyScripts[enemies[i].type](enemies[i]);
		}
	}

	function initEnemies() {
		for (var i=0; i<enemies.length; i++) {
			enemyInit[enemies[i].type](enemies[i]);
		}
	}

	function renderRockets() {
		for (var i=0; i<rockets.length; i++) {
			var obj = rockets[i]
			ctx.save();
			ctx.translate(obj.x-cameraX, obj.y-cameraY);
			ctx.rotate(obj.angle);
			ctx.drawImage(images["p/rocket.png"], -2.5, -8.5);
			ctx.restore();
		}
	}

	function renderEnemies() {
		for (var i=0; i<enemies.length; i++) {
			var obj = enemies[i]
			if (!(obj.alive)) continue;
			var img = images[obj.anim.frame]
			ctx.save();
			ctx.translate((obj.x+img.width/2)-cameraX, (obj.y+img.height/2)-cameraY)
			if (crosshair == i) {
				ctx.save();
				ctx.rotate(crossHairRot)
				var cimg = images["cross.png"]
				ctx.drawImage(cimg, cimg.width/-2, cimg.height/-2);
				ctx.restore();
				crossHairRot += 0.1;
			}
			ctx.scale(obj.facing, 1)
			ctx.drawImage(img, img.width/-2, img.height/-2);
			ctx.restore();
		}
	}

	function processAnimations() {
		for (var i=0; i<animObjs.length; i++) {
			var obj = animObjs[i]
			if (obj.animation != "") {
				var animObj = animations[obj.animation];
				obj.frameNum = (obj.frameNum+(1/animObj.playbackRate))%animObj.frames.length
				obj.frame = animObj.frames[Math.floor(obj.frameNum)];
			}
		}
	}

	function addParticle(x, y, xv, yv, type, duration, image, rv) {
		particles.push({
			x: x,
			y: y,
			ox: x,
			oy: y,
			xv: xv,
			yv: yv,
			colourCycle: 0,
			type: type,
			duration: duration,
			image: image || null,
			rv: rv || 0,
			a: 0
		})
	}

	function moveParticles() {
		for (var i=0; i<particles.length; i++) {
			var obj = particles[i]
			switch (obj.type) {
				case "spark":
					obj.yv += 0.2;
					obj.colourCycle += 0.03333332;
					obj.ox = obj.x;
					obj.oy = obj.y;
					obj.x += obj.xv;
					if (apcst(obj.x, obj.y)) { obj.x -= obj.xv; obj.xv *= -0.5 }
					obj.y += obj.yv;
					if (apcst(obj.x, obj.y)) { obj.y -= obj.yv; obj.yv *= -0.5 }
				break;
				case "image":
					obj.yv += 0.2;
					obj.x += obj.xv;
					if (apcst(obj.x, obj.y)) { obj.x -= obj.xv; obj.xv *= -0.5 }
					obj.y += obj.yv;
					if (apcst(obj.x, obj.y)) { obj.y -= obj.yv; obj.yv *= -0.5; obj.xv *= 0.9; obj.rv *= 0.9}
					obj.a += obj.rv;
				break;
				case "explosion":
					obj.colourCycle += obj.yv;
				break;
			}
			if (--obj.duration <= 0) particles.splice(i--, 1);
		}
	}

	function renderParticles() {
		for (var i=0; i<particles.length; i++) {
			var obj = particles[i]
			switch (obj.type) {
				case "spark":
					var sC = sparkStates[Math.floor(obj.colourCycle)]
					var eC = sparkStates[Math.ceil(obj.colourCycle)]
					var p = obj.colourCycle%1
					ctx.strokeStyle = "rgba("+Math.round(sC[0]*(1-p)+eC[0]*p)+", "+Math.round(sC[1]*(1-p)+eC[1]*p)+", "+Math.round(sC[2]*(1-p)+eC[2]*p)+", "+(sC[3]*(1-p)+eC[3]*p)+")";
					ctx.beginPath();
					ctx.moveTo(obj.ox-cameraX, obj.oy-cameraY);
					ctx.lineTo(obj.x-cameraX, obj.y-cameraY);
					ctx.stroke();
				break;
				case "image":
					var img = images[obj.image];
					ctx.save();
					ctx.translate(obj.x-cameraX, obj.y-cameraY)
					ctx.rotate(obj.a)
					if (obj.duration < 30) ctx.globalAlpha = obj.duration/30;
					ctx.drawImage(img, img.width/-2, img.height/-2);
					ctx.restore();
				break;
				case "explosion":
					ctx.beginPath();
					var outer = obj.xv*Math.sqrt(obj.colourCycle)
					var inner = (obj.xv*Math.sqrt((obj.colourCycle-0.5)*2))

					if (obj.colourCycle > 0.5) {
						ctx.arc(obj.x-cameraX, obj.y-cameraY, outer-((outer-inner)/2), 0, 2*Math.PI);
						ctx.lineWidth = (outer-inner)
						ctx.strokeStyle = obj.image;
						ctx.stroke();
						ctx.lineWidth = 1;
					} else {
						ctx.arc(obj.x-cameraX, obj.y-cameraY, outer, 0, 2*Math.PI);
						ctx.fillStyle = obj.image;
						ctx.fill();
					}
				break;
			}
		}
	}

	function advancedPointCollisionSystemTm(x, y) { //returns true or false
		var xTile = Math.floor(x / 16)
		var yTile = Math.floor(y / 16)
		var width = levels[level].width
		var height = levels[level].height
		var index = (width * yTile) + xTile
		if ((yTile > -1) && (yTile < height) && (xTile > -1) && (xTile < width)) {
			var tileNum = levels[level].data[index]
			return (tileNum != -1) // amazing
			//return tileColFunct[tileColisionBoxes[tileNum]](x%16, y%16)    soon
		}
	}

	function drawLevel() {
		//levels drawn at 2x size
		var width = levels[level].width
		var height = levels[level].height
		var data = levels[level].data
		var tileset = images[tilesets[levels[level].tileset]]
		var tswidth = tileset.width / 16
		var xTileStart = Math.floor(cameraX / 16)
		var xStart = (xTileStart * 16) - cameraX;
		var xTiles = (Math.ceil((canvas.width / 16)/scale) + 1)
		var yTile = Math.floor(cameraY / 16)
		var yPos = (yTile * 16) - cameraY;
		var yTiles = (Math.ceil((canvas.height / 16)/scale) + 1)
		ctx.fillStyle = "#000000"

		for (var i = 0; i < yTiles; i++) {
			var xTile = xTileStart
			var xPos = xStart
			var index = (width * yTile) + xTile
			if ((yTile > -1) && (yTile < height)) {
				for (var j = 0; j < xTiles; j++) {
					if ((xTile > -1) && (xTile < width)) {
						var tileNum = data[index]
						if (tileNum != -1) ctx.drawImage(tileset, (tileNum % tswidth) * 16, Math.floor(tileNum / tswidth) * 16, 16, 16, xPos, yPos, 16, 16);
					} else {
						ctx.fillRect(xPos, yPos, 16, 16);
					}
					index++;
					xTile++;
					xPos += 16;
				}
			} else {
				ctx.fillRect(xPos, yPos, xTiles*16, 16);
			}
			yTile++;
			yPos += 16
		}
	}
}