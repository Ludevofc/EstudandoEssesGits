
function ldGame(canvas2d, canvas3d) {

	var fragS = "precision mediump float;\n\
	\n\
	varying vec2 vTextureCoord;\n\
	\n\
	uniform sampler2D uSampler;\n\
	\n\
	void main(void) {\n\
		gl_FragColor = texture2D(uSampler, vTextureCoord);\n\
		if (gl_FragColor.a == 0.0) discard;\n\
	}"

	var vertS = "attribute vec3 aVertexPosition;\n\
	attribute vec2 aTextureCoord;\n\
	\n\
	uniform mat4 uMVMatrix;\n\
	uniform mat4 uPMatrix;\n\
	\n\
	varying vec2 vTextureCoord;\n\
	\n\
	\n\
	void main(void) {\n\
		gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n\
		vTextureCoord = aTextureCoord;\n\
	}"

	var lightFragS = "precision mediump float;\n\
	\n\
	varying vec2 vTextureCoord;\n\
	uniform vec3 lightPosition;\n\
	uniform vec3 lightCol;\n\
	uniform float intensity;\n\
	\n\
	uniform sampler2D colSampler;\n\
	uniform sampler2D normSampler;\n\
	\n\
	void main(void) {\n\
		vec3 lightDist = vec3(gl_FragCoord.xy, 0.0) - lightPosition;\n\
		vec3 lightDirection = normalize(lightDist);\n\
		vec3 normal = texture2D(normSampler, vTextureCoord).xyz;\n\
\n\
		normal = vec3((normal.x-0.5)*-2.0, (normal.y-0.5)*-2.0, (normal.z-0.5)*-2.0);\n\
		float lightInt = max(dot(normal, lightDirection), 0.0) * (intensity/(dot(lightDist, lightDist)));\n\
\n\
		gl_FragColor = texture2D(colSampler, vTextureCoord);\n\
		gl_FragColor.xyz *= lightInt;\n\
		gl_FragColor.xyz *= lightCol;\n\
		if (gl_FragColor.a == 0.0) discard;\n\
	}"


	//LOADER STUFF

	var images = {};
	var maps = {};
	var files = {};
	var sounds = {};
	var textures = {};
	var buffersExt;

	var totalFiles = 0;
	var doneFiles = 0;
	var deaths = 0;
	var gl, tileShader, lightShader, curMap, curMapDraw, ctx, bgB, bgTxB, audContext, lastFrame, timeAhead = 0, musicTime = 0, music, totalTime = 0;

	var finished, finishedTime, finishText, finishText2, finishPos;
	var timer, timerMax;

	var rtColour, rtNormal;
	var fbColour, fbNormal;
	var lightPosB, lightTxB

	var cameraX, cameraY, player, entities, tileColExempt = {}, worldMode = 0, deadCounter = 0, particles, lights;
	var mouseX, mouseY, mouseD, keyDownArray;

	//20s for fall, 20s for firstLevel, 30s for map1
	var mapUrls = ["firstLevel.json", "map2.json", "scale.json", "fall.json", "map1.json"];
	var imageUrls = ["tileset/generic.png",
		"player/player0.png",
		"player/player1.png",
		"player/player2.png",
		"tileset/mode0.png",
		"tileset/mode1.png",
		"tileset/mode2.png",
		"tileset/normal.png",
		"tileset/bg0.png",
		"tileset/bg1.png",
		"tileset/bg2.png",
		"tileset/bgNorm.png",
		"buttons.png",
		"torch.png",
		"goal.png",
	];
	var texUrls = ["tileset/generic.png", 
		"tileset/mode0.png",
		"tileset/mode1.png",
		"tileset/mode2.png",
		"tileset/normal.png",
		"tileset/bg0.png",
		"tileset/bg1.png",
		"tileset/bg2.png",
		"tileset/bgNorm.png",
	]; //must be loaded as image first

	var soundUrls = [
		"snap.wav",
		"restart.wav",
		"grapple.wav",
		"hardhit.wav",
		"boom.wav",
		"winvidia.wav",
		"i have lost it.wav",
		"switch.wav"
	]

	var finishTextChoice = [
		"GROOVY",
		"WICKED SICK",
		"NICE WHEELS",
		"FABULOUS",
		"FANTASTIC",
		"WONDERFUL",
		"AMAZING",
		"SMASHING",
		"EXTREME"
	]

	var nextLevelText = [
		"Never give up on your dreams!",
		"Self destruction in 3...",
		"Did you know there are more skeletons than people?",
		"1/100 people make it this far!",
		"EIGHT",
		"Rate the game 5 stars for everything",
		"There are more of these messages than there are levels!",
		"game is op pls nerf report spikes",
		"DIGITAL SPORTS",
		"good luck with the next level",
		"you can get out of the map on level 5",
		"at least it's more fun than i wanna be the guy",
		"i'm running out of ideas for these messages",
		"uhh",
		"yeah ok"
	]

	var rainbow = [
		"#FF0000",
		"#FFFF00",
		"#00FF00",
		"#00FFFF",
		"#0000FF",
		"#FF00FF",
	]

	var levelTimes = [
		30, 45, 25, 25, 30
	]

	var fireRamp = [
		[255, 255, 255, 1], //used for sparks and explosions
		[255, 192, 0, 1],
		[255, 64, 1, 1],
		[128, 0, 0, 1],
		[0, 0, 0, 0]
	]


	var displayList = {};

	loadResources();

	function loadResources() {
		ctx = canvas2d.getContext("2d");
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		audContext = new AudioContext();

		for (var i=0; i<mapUrls.length; i++) {
			loadMap(mapUrls[i]);
			totalFiles++;
		}
		for (var i=0; i<imageUrls.length; i++) {
			loadImage(imageUrls[i]);
			totalFiles++;
		}
		for (var i=0; i<soundUrls.length; i++) {
			loadSound(soundUrls[i]);
			totalFiles++;
		}
	}

	function updateProgress() {
		if (++doneFiles == totalFiles) {
			init();
		} else {
			ctx.clearRect(0, 0, canvas2d.width, canvas2d.height);

			ctx.strokeStyle = "#FFFFFF";
			ctx.fillStyle = "#FFFFFF";

			ctx.strokeRect(canvas2d.width/2-50.5, canvas2d.height/2-4.5, 101, 9); 
			ctx.fillRect(canvas2d.width/2-49, canvas2d.height/2-3, 98*(doneFiles/totalFiles), 6); 
			//draw progress bar
		}
	}

	function loadImage(url) {
		var img = new Image();
		img.src = url;
		img.onload = function(e) {
			images[url] = img;
			updateProgress();
		}
	}

	function loadFile(url) {
		var xml = new XMLHttpRequest();
		xml.open("GET", url, true);
		xml.responseType = "arraybuffer";
		xml.onload = function(e) {
			files[url] = xml.response;
			updateProgress();
		}
		xml.send();
	}

	function loadSound(url) {
		var xml = new XMLHttpRequest();
		xml.open("GET", url, true);
		xml.responseType = "arraybuffer";
		xml.onload = function(e) {
			audContext.decodeAudioData(xml.response, function(buffer) {
				sounds[url] = buffer;
				updateProgress();
			}, function(){alert("sound could not be read!")});
		}
		xml.send();
	}

	function loadMap(url) {
		var xml = new XMLHttpRequest();
		xml.open("GET", url, true);
		xml.responseType = "json";
		xml.onload = function(e) {
			maps[url] = xml.response;
			updateProgress();
		}
		xml.send();
	}

	// -------------------------------------------------
	// END LOADER
	// -------------------------------------------------

	function init() {
		globalTest = maps;
		lastFrame = Date.now();
		timeAhead = 0;
		level = 0;

		gl = initGL(canvas3d); //3d ctx is used for tile rendering - future plans to implement normal maps and deffered shading for cool lighting effects

		initRenderTargets();
		generateLightBuffers();
		gl.disable(gl.DEPTH_TEST);

		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.msImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;

		keyDownArray = new Array(255);
		mouseD = false;
		mouseX = 0;
		mouseY = 0;

		document.body.onmousemove = getMousePos;
		document.body.onmousedown = mouseDown;
		document.body.onmouseup = mouseUp;
		document.body.onkeydown = keyDown;
		document.body.onkeyup = keyUp;

		initShaders();
		setMap(level);

		for (var i=0; i<texUrls.length; i++) {
			textures[texUrls[i]] = loadTex(images[texUrls[i]]);
		}

		render();
	}

	function restartMap() {
		worldMode = 0;
		compileTileExempt(worldMode);
		cameraX = 0;
		cameraY = 0;
		deadCounter = 0;
		particles = [];
		lights = [];
		initObjects(curMap);
		finished = false;
		finishedTime = 0;

		musicTime = 0;
		music = playSound(sounds["i have lost it.wav"]);

		timer = timerMax;
	}

	function setMap(num) {
		var name = mapUrls[num];
		timerMax = levelTimes[num]*60; //convert to frames
		timer = timerMax;

		worldMode = 0;
		compileTileExempt(worldMode);

		curMap = maps[name];
		curMapDraw = generateTileMesh(curMap);
		cameraX = 0;
		cameraY = 0;
		deadCounter = 0;

		musicTime = 0;
		music = playSound(sounds["i have lost it.wav"]);

		particles = [];
		lights = [];
		initObjects(curMap);

		finished = false;
		finishedTime = 0;
	}

	function finish() {
		music.stop(0);
		finished = true;
		finishedTime = 0;
		finishText = finishTextChoice[Math.floor(Math.random()*finishTextChoice.length)]
		finishText2 = nextLevelText[Math.floor(Math.random()*nextLevelText.length)]
		finishPos = [];
		playSound(sounds["winvidia.wav"]);
	}

	// -------------------------------------------------
	// START DRAWING STUFF
	// -------------------------------------------------

	function initRenderTargets() {
		fbColour = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, fbColour);
		fbColour.width = canvas3d.width;
		fbColour.height = canvas3d.height;

		rtColour = initRenderTex(fbColour);

		fbNormal = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, fbNormal);	
		fbNormal.width = canvas3d.width;
		fbNormal.height = canvas3d.height;

		rtNormal = initRenderTex(fbNormal);
	}

	function initRenderTex(framebuffer) {
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, framebuffer.width, framebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


		var renderbuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, framebuffer.width, framebuffer.height);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.bindRenderbuffer(gl.RENDERBUFFER, null);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		return texture;
	}

	function initShaders() {
		frag = getShader(fragS, "frag");
		fragLight = getShader(lightFragS, "frag");
		vert = getShader(vertS, "vert");

		tileShader = gl.createProgram();
		gl.attachShader(tileShader, vert);
		gl.attachShader(tileShader, frag);
		gl.linkProgram(tileShader);

		if (!gl.getProgramParameter(tileShader, gl.LINK_STATUS)) {
			alert("Could not initialise shaders");
		}

		tileShader.vertexPositionAttribute = gl.getAttribLocation(tileShader, "aVertexPosition");
		gl.enableVertexAttribArray(tileShader.vertexPositionAttribute);

		tileShader.textureCoordAttribute = gl.getAttribLocation(tileShader, "aTextureCoord");
		gl.enableVertexAttribArray(tileShader.textureCoordAttribute);

		tileShader.pMatrixUniform = gl.getUniformLocation(tileShader, "uPMatrix");
		tileShader.mvMatrixUniform = gl.getUniformLocation(tileShader, "uMVMatrix");
		tileShader.samplerUniform = gl.getUniformLocation(tileShader, "uSampler");

		//light shader below

		lightShader = gl.createProgram();
		gl.attachShader(lightShader, vert);
		gl.attachShader(lightShader, fragLight);
		gl.linkProgram(lightShader);

		if (!gl.getProgramParameter(lightShader, gl.LINK_STATUS)) {
			alert("Could not initialise shaders");
		}

		lightShader.vertexPositionAttribute = gl.getAttribLocation(lightShader, "aVertexPosition");
		gl.enableVertexAttribArray(lightShader.vertexPositionAttribute);

		lightShader.textureCoordAttribute = gl.getAttribLocation(lightShader, "aTextureCoord");
		gl.enableVertexAttribArray(lightShader.textureCoordAttribute);

		lightShader.pMatrixUniform = gl.getUniformLocation(lightShader, "uPMatrix");
		lightShader.mvMatrixUniform = gl.getUniformLocation(lightShader, "uMVMatrix");
		lightShader.samplerUniform = gl.getUniformLocation(lightShader, "colSampler");
		lightShader.normSamplerUniform = gl.getUniformLocation(lightShader, "normSampler");

		lightShader.lightPosUniform = gl.getUniformLocation(lightShader, "lightPosition");
		lightShader.lightColUniform = gl.getUniformLocation(lightShader, "lightCol");
		lightShader.intensityUniform = gl.getUniformLocation(lightShader, "intensity");
	}

	function generateLightBuffers() {
		var lightPos = [
			0, 0, 0, canvas3d.width/2, 0, 0, 0, canvas3d.height/2, 0, canvas3d.width/2, 0, 0, 0, canvas3d.height/2, 0, canvas3d.width/2, canvas3d.height/2, 0
		]
		var lightTx = [
			0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0
		]

		lightPosB = gl.createBuffer();
		lightTxB = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, lightPosB);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lightPos), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, lightTxB);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lightTx), gl.STATIC_DRAW);
	}

	function getShader(str, type) {
		var shader;
		if (type == "frag") {
			shader = gl.createShader(gl.FRAGMENT_SHADER);
		} else if (type == "vert") {
			shader = gl.createShader(gl.VERTEX_SHADER);
		} else {
			return null;
		}

		gl.shaderSource(shader, str);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			alert(gl.getShaderInfoLog(shader));
			return null;
		}

		return shader;
	}

	function initGL(canvas) {
		try {
			var gl = canvas.getContext('webgl', {antialias: false, premultipliedAlpha: false, stencil: false});
			gl.clearColor(0,0,0,0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.enable(gl.DEPTH_TEST);
			gl.viewportWidth = canvas.width;
			gl.viewportHeight = canvas.height;
			return gl;
		} catch (err) {
			alert("WebGL could not be initialized.")
			return false;
		}
	}

	function render() {
		timeAhead += Date.now() - lastFrame;
		while (timeAhead > 0) {
			mainUpdate();
			timeAhead -= 1000/60;
		}

		lastFrame = Date.now();

		gl.useProgram(tileShader);
		ctx.clearRect(0, 0, canvas2d.width, canvas2d.height);
		ctx.save(); //init gl and 2d canvases

		var project = mat4.ortho(mat4.create(), 0, gl.viewportWidth/2, gl.viewportHeight/2, 0, -1, 10);
		var mv = mat4.create();
		mat4.translate(mv, mv, [gl.viewportWidth/4, gl.viewportHeight/4, 0])
		mat4.translate(mv, mv, [-cameraX, -cameraY, 0])
		ctx.scale(2, 2)

		ctx.translate(gl.viewportWidth/4, gl.viewportHeight/4);
		ctx.translate(-cameraX, -cameraY);
		//cameraY++;

		displayList = {};

		gl.uniformMatrix4fv(tileShader.mvMatrixUniform, false, mv);
		gl.uniformMatrix4fv(tileShader.pMatrixUniform, false, project);

		gl.clearColor(0,0,0,1);
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



		drawTilesDeferred();
		drawEntities();
		drawParticles();
		//ctx.drawImage(images["player/0.png"], 0, 0)
		//drawSprite("player/0.png", 0, 0);

		drawDisplayList(mv); //doesn't work right now
		ctx.restore();

		drawUI();

		requestAnimationFrame(render);
	}

	function drawUI() {
		ctx.save();
		ctx.drawImage(images["buttons.png"], 15, canvas2d.height-110)
		ctx.scale(2, 2);
		drawTimer();
		if (finished) drawFinishScreen();
		ctx.restore();
	}

	function drawFinishScreen() {
		if (level < 4) {
			if (finishPos.length == 0) finishPos.push(-100);
			if (finishPos.length > 30) finishPos.splice(0, 1)

			var textPos = finishPos[finishPos.length-1];
			textPos += ((canvas2d.height/4)-textPos)/10;

			ctx.font = "bold 58px Verdana, sans-serif"
			var txtlength = ctx.measureText(finishText).width
			ctx.globalAlpha = 1;
			for (var i=0; i<finishPos.length; i++) {
				ctx.fillStyle = rainbow[(i+((finishedTime>30)?0:finishedTime-30))%rainbow.length];
				ctx.fillText(finishText, (canvas2d.width/4-txtlength/2), finishPos[i]);
			}
			ctx.fillStyle = "#FFFFFF";
			ctx.fillText(finishText, (canvas2d.width/4-txtlength/2), textPos);
			finishPos.push(textPos);

			if (finishedTime > 60) {
				var text = finishText2;
				ctx.font = "bold 16px Verdana, sans-serif"
				var txtlength = ctx.measureText(text).width

				ctx.fillStyle = "#FFFFFF";
				ctx.strokeStyle = "#000000";

				ctx.lineWidth = 6;

				ctx.globalAlpha = 0.5;
				ctx.strokeText(text, (canvas2d.width/4-txtlength/2), (canvas2d.height/4)+22);
				ctx.globalAlpha = 1;
				ctx.fillText(text, (canvas2d.width/4-txtlength/2), (canvas2d.height/4)+20);
			}
		} else {
			if (finishedTime < 90) {
				ctx.fillStyle = "#FFFFFF";
				ctx.font = "bold 58px Verdana, sans-serif"
				ctx.textBaseline="top";
				var txtSize = ctx.measureText("YOU")

				ctx.save();
				ctx.scale((canvas2d.width/2)/txtSize.width, (canvas2d.height/4)/58);
				ctx.fillText("YOU", 0, -10)
				ctx.restore();

				if (finishedTime > 45) {
					var txtSize = ctx.measureText("WIN")

					ctx.save();
					ctx.scale((canvas2d.width/2)/txtSize.width, (canvas2d.height/4)/58);
					ctx.fillText("WIN", 0, 58-10);
					ctx.restore();
				}
			} else {
				ctx.fillStyle = rainbow[finishedTime%rainbow.length];
				ctx.font = "bold 58px Verdana, sans-serif"
				ctx.textBaseline="top";
				var txtSize = ctx.measureText("VIDEOGAMES")

				ctx.save();
				ctx.scale((canvas2d.width/2)/txtSize.width, (canvas2d.height/2)/58);
				ctx.fillText("VIDEOGAMES", 0, -9)
				ctx.restore();
				if (finishedTime>120) {
					var text = "You died a total of "+deaths+" times! Time: "+Math.round((totalTime/60)*100)/100+" seconds."
					ctx.font = "bold 16px Verdana, sans-serif"
					var txtlength = ctx.measureText(text).width

					ctx.fillStyle = "#FFFFFF";
					ctx.strokeStyle = "#000000";

					ctx.lineWidth = 6;

					ctx.globalAlpha = 0.5;
					ctx.strokeText(text, (canvas2d.width/4-txtlength/2), (canvas2d.height/2)-20);
					ctx.globalAlpha = 1;
					ctx.fillText(text, (canvas2d.width/4-txtlength/2), (canvas2d.height/2)-22);
				}
			}

		}
	}

	function drawEntities() {
		for (var i=0; i<entities.length; i++) {
			var ent = entities[i];
			if (ent.render == null) ctx.drawImage(images[ent.img], ent.x, ent.y);
			else ent.render();
		}
	}

	function drawSprite(img, x, y, rotation, scale) {
		var scale = scale
		if (scale == null) scale = 1;
		var obj = {}
		var mat = mat4.create();
		var imgA = images[img];
		mat4.scale(mat, mat, [imgA.width*scale, imgA.height*scale, scale]);
		mat4.rotateZ(mat, mat, rotation);
		mat4.translate(mat, mat, [x, y, -0.01]);
		obj.mat = mat;
		obj.img = img;

		if (displayList[img] == null) displayList[img] = [];
		displayList[img].push(obj);
	}

	function drawDisplayList(mv) {
		var spr = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0]);
		var sprTx = new Float32Array([0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1]);


		var sprB = gl.createBuffer();
		var sprTxB = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, sprB);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(spr), gl.STATIC_DRAW);
		gl.vertexAttribPointer(tileShader.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, sprTxB);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sprTx), gl.STATIC_DRAW);
		gl.vertexAttribPointer(tileShader.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

		for (img in displayList) {
			var sprs = displayList[img];
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, textures[img]); //load up material texture
			gl.uniform1i(tileShader.samplerUniform, 0);

			for (var i=0; i<sprs.length; i++) {
				var obj = sprs[i];
				gl.uniformMatrix4fv(tileShader.mvMatrixUniform, false, mat4.multiply(obj.mat, obj.mat, mv));
				gl.drawArrays(gl.TRIANGLES, 0, 6);
			}
		}
	}

	function drawTilesDeferred() {
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.clearColor(0.0,0.0,0.0,1);
		gl.bindFramebuffer(gl.FRAMEBUFFER, fbColour);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		drawTiles(false);
		gl.clearColor(0.5,0.5,1,1);
		gl.bindFramebuffer(gl.FRAMEBUFFER, fbNormal);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		drawTiles(true);

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		drawLights();
		//todo: draw deffered lighting
	}

	function drawLights() {
		gl.useProgram(lightShader);

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);

		var project = mat4.ortho(mat4.create(), 0, gl.viewportWidth/2, gl.viewportHeight/2, 0, -1, 10);
		var mv = mat4.create();

		gl.uniformMatrix4fv(lightShader.mvMatrixUniform, false, mv);
		gl.uniformMatrix4fv(lightShader.pMatrixUniform, false, project);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, rtColour); //load up material texture
		gl.uniform1i(lightShader.samplerUniform, 0);

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, rtNormal); //load up material texture
		gl.uniform1i(lightShader.normSamplerUniform, 1);

		gl.bindBuffer(gl.ARRAY_BUFFER, lightPosB);
		gl.vertexAttribPointer(lightShader.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, lightTxB);
		gl.vertexAttribPointer(lightShader.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

		for (var i=0; i<lights.length; i++) {
			var lgt = lights[i];

			var iMul = 1;
			if (lgt.time != "forever") {
				lgt.time -= lgt.timeChange;
				if (lgt.time <= 0) {
					lights.splice(i--, 1);
					continue;
				}
				iMul = lgt.time;
			}

			gl.uniform3fv(lightShader.lightPosUniform, new Float32Array([(lgt.x-cameraX)*2+canvas3d.width/2, canvas3d.height/2-(lgt.y-cameraY)*2, lgt.zdist]));
			gl.uniform3fv(lightShader.lightColUniform, lgt.colour);
			gl.uniform1f(lightShader.intensityUniform, lgt.intensity*iMul); //should be around 10000 most of the time

			gl.drawArrays(gl.TRIANGLES, 0, 6);
		}
	}

	function addLight(x, y, intensity, colour, zdist, time, timeChange) {
		var obj = {
			x:x,
			y:y,
			intensity: intensity,
			colour: colour,
			zdist: zdist,
			time: (time == null)?"forever":time,
			timeChange: timeChange
		}
		lights.push(obj);
		return obj;
	}

	function removeLight(light) {
		lights.splice(lights.indexOf(light), 1);
	}

	function drawTiles(normal) {

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textures[(normal)?"tileset/bgNorm.png":("tileset/bg"+worldMode+".png")]); //load up material texture
		gl.uniform1i(tileShader.samplerUniform, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, bgB);
			gl.vertexAttribPointer(tileShader.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, bgTxB);
			gl.vertexAttribPointer(tileShader.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

			gl.drawArrays(gl.TRIANGLES, 0, 6);


		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textures[(normal)?"tileset/normal.png":("tileset/mode"+worldMode+".png")]); //load up material texture
		gl.uniform1i(tileShader.samplerUniform, 0);

		for (var i=0; i<curMapDraw.length; i++) {
			var obj = curMapDraw[i];

			gl.bindBuffer(gl.ARRAY_BUFFER, obj.posB);
			gl.vertexAttribPointer(tileShader.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, obj.txB);
			gl.vertexAttribPointer(tileShader.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

			gl.drawArrays(gl.TRIANGLES, 0, obj.verts);
		}

	}

	function generateTileMesh(map) {
		var layers = [];
		for (var i=0; i<map.layers.length; i++) {
			var pos = [];
			var tx = [];
			var layer = map.layers[i]
			if (layer.type != "tilelayer") continue;

			var off = 0;
			var tilePx = 16;
			var tileSize = tilePx/256; //change according to tileset size
			var tilesPL = 256/tilePx;
			var verts = 0;
			for (var y=0; y<layer.height; y++) {
				for (var x=0; x<layer.width; x++) {
					//lt vert
					var tile = layer.data[off++]-1;

					if (tile == -1) continue;
					pos.push(x*tilePx);
					pos.push(y*tilePx);
					pos.push(0);

					tx.push((tile*tileSize)%1);
					tx.push(Math.floor(tile/tilesPL)*tileSize);

					//rt vert

					pos.push((x+1)*tilePx);
					pos.push(y*tilePx);
					pos.push(0);

					tx.push(((tile*tileSize)%1)+tileSize);
					tx.push(Math.floor(tile/tilesPL)*tileSize);

					//lb vert

					pos.push(x*tilePx);
					pos.push((y+1)*tilePx);
					pos.push(0);

					tx.push((tile*tileSize)%1);
					tx.push(Math.floor(tile/tilesPL)*tileSize+tileSize);

					//dupe for tri 2

					//rt vert

					pos.push((x+1)*tilePx);
					pos.push(y*tilePx);
					pos.push(0);

					tx.push(((tile*tileSize)%1)+tileSize);
					tx.push(Math.floor(tile/tilesPL)*tileSize);

					//lb vert

					pos.push(x*tilePx);
					pos.push((y+1)*tilePx);
					pos.push(0);

					tx.push((tile*tileSize)%1);
					tx.push(Math.floor(tile/tilesPL)*tileSize+tileSize);

					//pos = pos.concat(pos.slice(pos.length-6));
					//tx = tx.concat(tx.slice(tx.length-4));

					//rb vert

					pos.push((x+1)*tilePx);
					pos.push((y+1)*tilePx);
					pos.push(0);

					tx.push(((tile*tileSize)%1)+tileSize);
					tx.push(Math.floor(tile/tilesPL)*tileSize+tileSize);
					verts += 6;
				}
			}

			var posB = gl.createBuffer();
			var txB = gl.createBuffer();

			gl.bindBuffer(gl.ARRAY_BUFFER, posB);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

			gl.bindBuffer(gl.ARRAY_BUFFER, txB);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tx), gl.STATIC_DRAW);

			layers.push({
				posB: posB,
				txB: txB,
				verts: verts
			})
		}

		var width = map.width*map.tilewidth;
		var height = map.height*map.tileheight;

		console.log(width);
		console.log(height);

		var txMapW = height/32;
		var txMapH = width/32;

		var bg = [
			0, 0, 0, width, 0, 0, 0, height, 0, width, 0, 0, 0, height, 0, width, height, 0
		]
		var bgTx = [
			0, txMapW, txMapH, txMapW, 0, 0, txMapH, txMapW, 0, 0, txMapH, 0
		]

		bgB = gl.createBuffer();
		bgTxB = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, bgB);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bg), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, bgTxB);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bgTx), gl.STATIC_DRAW);

		return layers;
	}

	function loadTex(img) { //general purpose function for loading an image into a texture.
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		texture.width = img.width;
		texture.height = img.height;

		gl.bindTexture(gl.TEXTURE_2D, null);
		return texture;
	}

	function drawTimer() {
		ctx.save();
		ctx.translate(canvas2d.width/2-47, 47);
		ctx.scale(1, 1);

		ctx.beginPath();
		ctx.arc(0, 3, 35, 0, 2*Math.PI);
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fill();

		ctx.beginPath();
		ctx.arc(0, 0, 32, 0, 2*Math.PI);
		ctx.fillStyle = "#FFFFFF";
		ctx.fill();

		//counter segment

		ctx.beginPath();
		ctx.arc(0, 0, 27.5, 0, 2*Math.PI);
		ctx.fillStyle = "#00D900";
		ctx.fill();

		ctx.beginPath();
		ctx.arc(0, 0, 27.5, -Math.PI/2, (timer/timerMax)*-2*Math.PI-Math.PI/2);
		ctx.fillStyle = "#CCCCCC";
		ctx.lineTo(0, 0)
		ctx.fill();

		//counter text

		var time = Math.ceil(timer/60)+"s";

		ctx.font = "bold 22px Verdana, sans-serif"
		var txtlength = ctx.measureText(time).width

		ctx.fillStyle = "#000000";

		ctx.globalAlpha = 0.25;
		ctx.fillText(time, (-txtlength/2), 10);
		ctx.globalAlpha = 1;

		ctx.fillStyle = "#FFFFFF";
		ctx.fillText(time, (-txtlength/2), 8);

		ctx.restore();
	}

	// -------------------------------------------------
	// END DRAWING STUFF
	// -------------------------------------------------

	function mainUpdate() {
		if (player.dead) {
			if (++deadCounter > 90) restartMap();
		} else if (finished) {

			finishedTime++;
			music.stop
			if (level != 4 && finishedTime > 120) setMap(++level);

		} else {
			totalTime++;
			if (keyDownArray[82]) player.kill();
			if (keyDownArray[49]) {
				if (worldMode != 0) {
					playSound(sounds["switch.wav"]); worldMode=0; compileTileExempt(0); player.testInWall();
				}
			} else if (keyDownArray[50]) {
				if (worldMode != 1) {
					playSound(sounds["switch.wav"]); worldMode=1; compileTileExempt(1); player.testInWall();
				}
			} else if (keyDownArray[51]) {
				if (worldMode != 2) {
					playSound(sounds["switch.wav"]); worldMode=2; compileTileExempt(2); player.testInWall();
				}
			}
			if (--timer <= 0) player.kill();
			if (musicTime++ > 29.33*60) {
				music = playSound(sounds["i have lost it.wav"]);
				musicTime = 0;
			}
		}

		updateParticles();
		updateEntities();
	}

	function updateEntities() {
		var entCopy = entities.slice(0);
		for (var i=0; i<entCopy.length; i++) {
			var ent = entCopy[i];
			if (ent.update != null) ent.update();
		}
	}

	var grassExempt = [
		6, 22, 38, 70, //vert grass
		119, 120, 122, 123 //horiz grass
	]

	var iceExempt = [
		7, 23, 39, 71, //vert ice
		103, 104, 106, 107 //horiz ice
	]

	var fireExempt = [
		8, 24, 40, 72, //vert fire
		87, 88, 90, 91 //horiz fire
	]

	var killTiles = [
		97, 98,
		113, 114
	]

	function compileTileExempt(mode) {
		tileColExempt = {};
		if (mode != 0) for (var i=0; i<grassExempt.length; i++) tileColExempt[grassExempt[i]] = true;
		if (mode != 1) for (var i=0; i<iceExempt.length; i++) tileColExempt[iceExempt[i]] = true;
		if (mode != 2) for (var i=0; i<fireExempt.length; i++) tileColExempt[fireExempt[i]] = true;
	}

	function tileSolidAt(x, y) {
		//test if the tile at the specified pixel position is solid
		var colLayer = curMap.layers[0];
		var tile = colLayer.data[Math.floor(y/16)*colLayer.width+Math.floor(x/16)];
		return (tileColExempt[tile])?0:tile;
	}

	function testRect(x, y, width, height) { //very rough, but fast and good for what i require
		return (tileSolidAt(x, y) || tileSolidAt(x+width, y) || tileSolidAt(x, y+height) || tileSolidAt(x+width, y+height));
	}

	function initObjects(map) {
		entities = [];
		for (var i=0; i<map.layers.length; i++) {
			var layer = map.layers[i]
			if (layer.type != "objectgroup") continue;
			for (var j=0; j<layer.objects.length; j++) {
				var obj = layer.objects[j];
				switch (obj.gid) {
					case 254: //end of level
						var levelEnd = new LevelEnd(obj.x, obj.y-16);
						entities.push(levelEnd);
						break;
					case 255: //torch
						var torch = new Torch(obj.x, obj.y-16);
						entities.push(torch);
						break;
					case 256: //player spawn point
						player = new PlayerObj(obj.x, obj.y-16);
						entities.push(player);
						break;
				}
			}
		}
	}

	function removeEntity(ent) {
		entities.splice(entities.indexOf(ent), 1);
	}

	function Torch(x, y) {
		this.img = "torch.png";
		this.x = x;
		this.y = y;

		var light = null;
		var thisObj = this;

		this.update = update;

		function update() {
			var xd = thisObj.x+8-cameraX;
			var yd = thisObj.y+8-cameraY;
			var dist = Math.sqrt(xd*xd+yd*yd);
			if (light != null) {
				light.zdist = 145+Math.random()*20
				if (dist > 500) {
					removeLight(light);
					light = null;
				}
			} else {
				if (dist < 500) {
					light = addLight(thisObj.x+8, thisObj.y+8, 30000, new Float32Array([1, 0.75, 0.5]), 150)
				}
			}
		}
	}

	function LevelEnd(x, y) {
		this.x = x;
		this.y = y;

		var particles = [];

		var light = addLight(this.x+16, this.y+16, 20000, new Float32Array([1, 1, 0.5]), 50, "forever")

		this.render = render;
		this.update = update;
		var thisObj = this;

		function update() {
			for (var i=0; i<particles.length; i++) {
				var p = particles[i];

				p.x += p.xv;
				p.y += p.yv;
				p.xv += p.xvv;
				p.yv += p.yvv;

				if (p.duration++ > 90) particles.splice(i--, 1)
			}

			particles.push({
				x: thisObj.x+Math.random()*32,
				y: thisObj.y+16,
				xv: (Math.random()-0.5)*0.25,
				xvv: (Math.random()-0.5)*0.04,
				yv: Math.random()*-0.25,
				yvv: Math.random()*-0.04,
				duration: 0
			});

			if (!finished) {
				var xd = thisObj.x+16-player.x;
				var yd = thisObj.y-player.y;

				var dist = Math.sqrt(xd*xd+yd*yd);

				if (dist < 32) finish();
			}
		}

		function render() {
			ctx.drawImage(images["goal.png"], thisObj.x, thisObj.y-16);
			for (var i=0; i<particles.length; i++) {
				var p = particles[i];
				ctx.globalAlpha = Math.min(1, Math.max(0, 3-(p.duration/30)));
				ctx.fillStyle = "#FFFFCC";
				ctx.fillRect(p.x, p.y, 2, 2);
			} 
			ctx.globalAlpha = 1;
		}
	}

	function PlayerObj(x, y) {
		this.img = "player/player0.png";
		this.x = x;
		this.y = y;
		this.xv = 0;
		this.yv = 0;
		this.grapple = null;
		this.dead = false;
		var light = addLight(this.x, this.y, 90000, new Float32Array([1, 1, 1]), 300)
		var thisObj = this;

		var hitFloorFrames = 0;
		this.update = update;
		this.render = render;
		this.kill = kill;
		this.testInWall = testInWall;

		function update() {
			for (var i=0; i<2; i++) { //run player physics at 120 fps... you know... for safety
				if (thisObj.dead) return;
				if (finished) return;

				if (thisObj.grapple == null) {
					if (mouseD) {
						thisObj.grapple = new GrappleHook(thisObj, (mouseX/2)+cameraX-(canvas2d.width/4), (mouseY/2)+cameraY-(canvas2d.height/4));
						entities.push(thisObj.grapple);
					}
					thisObj.yv += 0.05;
				} else {
					if (!mouseD || thisObj.grapple.broken) {
						removeEntity(thisObj.grapple);
						entities.push(new SnappedGrapple(thisObj.grapple.x, thisObj.grapple.y, thisObj.x+6, thisObj.y, !mouseD));
						thisObj.grapple = null;
						thisObj.yv += 0.05;
					} else if (thisObj.grapple.hit) {
						var grp = thisObj.grapple;
						var xd = thisObj.x+6-grp.x;
						var yd = thisObj.y+6-grp.y;

						var dist = Math.sqrt(xd*xd+yd*yd);

						thisObj.xv -= (xd/dist)/10 + xd/3000;
						thisObj.yv -= (yd/dist)/10 + yd/3000;
					} else {
						thisObj.yv += 0.05;
					}
				}

				thisObj.y += thisObj.yv;
				var col = testRect(this.x+2, this.y, 8, 15);
				if (killTiles.indexOf(col) != -1) kill();
				if (col) {
					if (thisObj.yv > 0) hitFloorFrames = 6;
					thisObj.y -= thisObj.yv;
					if (thisObj.yv>0) thisObj.yv = -1.5;
					else thisObj.yv = 0;
					thisObj.xv *= 0.9;
				}

				thisObj.x += thisObj.xv;
				var col = testRect(this.x+2, this.y, 8, 15);
				if (killTiles.indexOf(col) != -1) kill();
				if (col) {
					thisObj.x -= thisObj.xv;
					thisObj.xv = 0;
				}

				light.y = thisObj.y+7;
				light.x = thisObj.x+6; 

				cameraY = thisObj.y+7;
				cameraX = thisObj.x+6;

				if (hitFloorFrames > 0) {
					hitFloorFrames--;
					thisObj.img = "player/player2.png"
				} else {
					thisObj.img = "player/player"+((thisObj.yv>0)?1:0)+".png"
				}
			}
		}

		function kill() {
			deaths++;
			music.stop(0);
			thisObj.dead = true;
			playSound(sounds["boom.wav"]);
			addParticle(thisObj.x+8, thisObj.y+8, 75, 1/15, "explosion", 15, "#FFFFFF", 0)
			explodeALot(thisObj.x+8, thisObj.y+8, 100, 10, 15)
			sparkBoom(thisObj.x+8, thisObj.y+8, 7, 0, 0, 100)

			var light2 = addLight(thisObj.x, thisObj.y, 50000, new Float32Array([1, 1, 1]), 150, 1, 1/30)

			if (thisObj.grapple != null) {
				removeEntity(thisObj.grapple);
				entities.push(new SnappedGrapple(thisObj.grapple.x, thisObj.grapple.y, thisObj.x+6, thisObj.y));
				thisObj.grapple = null;
			}
		}

		function render() {
			if (!thisObj.dead) ctx.drawImage(images[thisObj.img], thisObj.x, thisObj.y);
		}

		function testInWall() {
			if (thisObj.grapple != null) {
				thisObj.grapple.confirmWallSolid();
			}
			if (testRect(this.x+2, this.y, 8, 15)) {
				playSound(sounds["hardhit.wav"]);
				kill();
			}
		}
	}

	function GrappleHook(player, tx, ty) {
		this.x = player.x+6;
		this.y = player.y;
		var xd = tx-this.x;
		var yd = ty-this.y;
		var dist = Math.sqrt(xd*xd+yd*yd);
		this.xv = (xd/dist)*2;
		this.yv = (yd/dist)*2;
		this.hit = false;
		this.update = update;
		this.render = render;
		this.broken = false;
		this.confirmWallSolid = confirmWallSolid;
		var thisObj = this;

		function update() {
			if (!thisObj.hit) {
				for (var i=0; i<15; i++) { //move 30 steps every frame.
					thisObj.x += thisObj.xv;
					thisObj.y += thisObj.yv;

					var xd = thisObj.x-player.x+6;
					var yd = thisObj.y-player.y;
					var dist = Math.sqrt(xd*xd+yd*yd);
					var col = tileSolidAt(thisObj.x, thisObj.y)
					if (dist > 175) {
						thisObj.broken = true;
						return;
					}
					else if (col) {
						if (killTiles.indexOf(col) != -1) {
							thisObj.broken = true;
							return;
						}
						sparkBoom(thisObj.x-thisObj.xv, thisObj.y-thisObj.yv, 7, -thisObj.xv, -thisObj.yv, 10)
						playSound(sounds["grapple.wav"])
						thisObj.hit = true;
						addLight(this.x, this.y, 20000, new Float32Array([1, 0.6, 0]), 100, 1, 1/20)
						break;
					}
				}
			} else {
				var xd = thisObj.x-player.x+6;
				var yd = thisObj.y-player.y;
				var dist = Math.sqrt(xd*xd+yd*yd);
				if (dist > 190) thisObj.broken = true;
			}
		}

		function render() {
			ctx.save();
			ctx.strokeStyle = "#FFFFFF"
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.moveTo(player.x+6, player.y);
			ctx.lineTo(thisObj.x, thisObj.y);
			ctx.stroke();

			ctx.strokeStyle = "#663300"
			ctx.lineWidth = 2;

			ctx.stroke();

			ctx.restore();
		}

		function confirmWallSolid() {
			if (!tileSolidAt(thisObj.x, thisObj.y)) thisObj.broken = true;
		}
	}

	function SnappedGrapple(x1, y1, x2, y2, gray) {
		var time;

		playSound(sounds["snap.wav"])

		if (gray) time = 30;
		else time = 0;

		var segments = [];
		for (var i=0; i<10; i++) {
			var t = i/9;
			var u = 1-t;
			segments.push({x: x1*u+x2*t, y: y1*u+y2*t, xv:Math.random()*10-5, yv:Math.random()*10-5});
		}

		var xd = x1-x2;
		var yd = y1-y2;
		var dist = Math.sqrt(xd*xd+yd*yd);

		var minDist = dist/20;

		this.update = update;
		this.render = render;
		var thisObj = this;

		function update() {
			for (var i=0; i<10; i++) {
				var obj = segments[i];

				if (i != 0) latchOnto(obj, segments[i-1]);
				if (i != 9) latchOnto(obj, segments[i+1]);
				obj.yv += 0.10;

				obj.y += obj.yv;
				if (tileSolidAt(obj.x, obj.y)) {
					obj.y -= obj.yv;
					obj.yv = obj.yv * -0.2;
				}

				obj.x += obj.xv;
				if (tileSolidAt(obj.x, obj.y)) {
					obj.x -= obj.xv;
					obj.xv = obj.xv * -0.2;
				}
				obj.yv *= 0.95;
				obj.xv *= 0.95;
			}
			time++;
			if (time>120) removeEntity(thisObj);
		}

		function latchOnto(obj, obj2) {
			var xd = obj2.x-obj.x;
			var yd = obj2.y-obj.y;
			var dist = Math.sqrt(xd*xd+yd*yd);
			if (dist > minDist) {
				obj.xv += (xd-((xd/dist)*minDist))/15
				obj.yv += (yd-((yd/dist)*minDist))/15
			}
		}

		function render() {
			ctx.save();
			ctx.beginPath();
			var mainCol = [255, 255, 255, 0.5];
			var startCol = [255, 0, 0, 1];
			var endCol = [128, 128, 128, 0];

			var col = (time>90)?colourLerp(mainCol, endCol, (time-90)/30):((time>30)?mainCol:colourLerp(startCol, mainCol, time/30))

			ctx.lineWidth = 2;
			ctx.strokeStyle = "rgba("+col[0]+","+col[1]+","+col[2]+","+col[3]+")"
			ctx.moveTo(segments[0].x, segments[0].y);
			for (var i=1; i<10; i++) ctx.lineTo(segments[i].x, segments[i].y);
			ctx.stroke();
			ctx.restore();
		}
	}

	//input handlers

	function getMousePos(evt) {
		var el = canvas2d;
		var _x = 0;
		var _y = 0;
		while( el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop) ) {
			_x += el.offsetLeft;
			_y += el.offsetTop;
			el = el.offsetParent;
		}
		mouseX = evt.pageX - _x;
		mouseY = evt.pageY - _y;
	}

	function mouseDown(evt) {
		mouseD = true;
	}

	function mouseUp(evt) {
		mouseD = false;
	}

	function keyDown(evt) {
		console.log(evt.keyCode);
		keyDownArray[evt.keyCode] = true;
	}

	function keyUp(evt) {
		keyDownArray[evt.keyCode] = false;
	}

	//
	// PARTICLE ENGINE, v2 repurposed from low battery particles (that's allowed right? it's not a separate lib in low battery but it's not a whole game either!)
	//

	var particleUpdt = {};
	var particleRend = {};

	function addParticle(x, y, xv, yv, type, duration, image, rv) {
		particles.push({
			x: x,
			y: y,
			ox: x-cameraX,
			oy: y-cameraY,
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

	function sparkBoom(x, y, intensity, offxv, offyv, num) {
		for (var i=0; i<num; i++) {
			var ang = Math.random()*Math.PI*2;
			var power = intensity*Math.random();
			addParticle(x, y, (Math.cos(ang)*power)+offxv, (Math.sin(ang)*power)+offyv, "spark", 60)
		}
	}

	function explodeALot(x, y, diameter, num, delay) {
		for (var i=0; i<num; i++) {		
			var rC = fireRamp[Math.floor((Math.random()*4))]
			var d = Math.random()*delay;
			addParticle(x+(Math.random()-0.5)*diameter, y+(Math.random()-0.5)*diameter, (Math.random()*15)+10, 1/15, "explosion", 15+d, "rgb("+rC[0]+", "+rC[1]+", "+rC[2]+")", d);
		}
	}

	particleUpdt["spark"] = function(obj) {
		obj.yv += 0.05;
		obj.colourCycle += 0.066;
		obj.ox = obj.x-cameraX;
		obj.oy = obj.y-cameraY;
		obj.x += obj.xv;
		if (tileSolidAt(obj.x, obj.y)) { obj.x -= obj.xv; obj.xv *= -0.5 }
		obj.y += obj.yv;
		if (tileSolidAt(obj.x, obj.y)) { obj.y -= obj.yv; obj.yv *= -0.5 }
	}

	particleUpdt["image"] = function(obj) {
		obj.yv += 0.05;
		obj.x += obj.xv;
		if (tileSolidAt(obj.x, obj.y)) { obj.x -= obj.xv; obj.xv *= -0.5 }
		obj.y += obj.yv;
		if (tileSolidAt(obj.x, obj.y)) { obj.y -= obj.yv; obj.yv *= -0.5; obj.xv *= 0.9; obj.rv *= 0.9}
		obj.a += obj.rv;
	}

	particleUpdt["explosion"] = function(obj) {
		if (obj.rv > 0) { obj.rv -= 1; return; }
		obj.colourCycle += obj.yv;
	}

	function updateParticles() {
		for (var i=0; i<particles.length; i++) {
			var obj = particles[i]
			particleUpdt[obj.type](obj);
			if (--obj.duration <= 0) particles.splice(i--, 1);
		}
	}

	particleRend["spark"] = function(obj) {
		var col = colourLerp(fireRamp[Math.floor(obj.colourCycle)], fireRamp[Math.ceil(obj.colourCycle)], obj.colourCycle%1);
		ctx.strokewidth = 0.5;
		ctx.strokeStyle = "rgba("+col[0]+", "+col[1]+", "+col[2]+", "+col[3]+")";
		ctx.beginPath();
		ctx.moveTo(obj.ox+cameraX, obj.oy+cameraY);
		ctx.lineTo(obj.x, obj.y);
		ctx.stroke();
	}

	particleRend["image"] = function(obj) {
		var img = images[obj.image];
		ctx.save();
		ctx.translate(obj.x, obj.y)
		ctx.rotate(obj.a)
		if (obj.duration < 30) ctx.globalAlpha = obj.duration/30;
		ctx.drawImage(img, img.width/-2, img.height/-2);
		ctx.restore();
	}

	particleRend["explosion"] = function(obj) {
		if (obj.rv > 0) return;
		ctx.beginPath();
		var outer = obj.xv*Math.sqrt(obj.colourCycle)
		var inner = (obj.xv*Math.sqrt((obj.colourCycle-0.5)*2))

		if (obj.colourCycle > 0.5) {
			ctx.arc(obj.x, obj.y, outer-((outer-inner)/2), 0, 2*Math.PI);
			ctx.lineWidth = (outer-inner)
			ctx.strokeStyle = obj.image;
			ctx.stroke();
			ctx.lineWidth = 1;
		} else {
			ctx.arc(obj.x, obj.y, outer, 0, 2*Math.PI);
			ctx.fillStyle = obj.image;
			ctx.fill();
		}
	}

	function drawParticles() {
		for (var i=0; i<particles.length; i++) {
			var obj = particles[i]
			particleRend[obj.type](obj);
		}
	}

	function playSound(buffer) {
		var source = audContext.createBufferSource();
		source.buffer = buffer;
		source.connect(audContext.destination);
		source.start(0);
		return source;
	}

	function colourLerp(c1, c2, p) {
		var u = 1-p;
		return [Math.round(c1[0]*u+c2[0]*p), Math.round(c1[1]*u+c2[1]*p), Math.round(c1[2]*u+c2[2]*p), c1[3]*u+c2[3]*p];
	}
}