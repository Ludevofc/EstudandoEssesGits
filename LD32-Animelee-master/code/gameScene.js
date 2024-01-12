var GRAVITY = 0.25;	

function gameScene(game, clientScene) {
	var ctx = game.ctx;
	var canvas = game.canvas;
	var files = game.files;

	var t = this;
	var elapsed = 0;
	var music;

	//post compo mute feature
	var lastMM = false;
	var lastAM = false; //all mute

	var defaultCog = Math.PI/60;

	t.levelInfo = {
		width:1300,
		height:975,

		itemSpawns: [
			{p: [718, 393], r:2}, //top alcove
			{p: [1220, 512], r:3}, //under alcove
			{p: [586, 899], r:1}, //map bottom
			{p: [71, 550], r:1}, //topleft
			{p: [334, 113], r:1}, //special left
			{p: [970, 113], r:1} //special right
		],

		respawns: [
			[600, 130],
			[700, 130],
			[650, 260],
			[587, 674],
			[724, 773],
			[1000, 662],
			[203, 693],
			[157, 523],
			[1218, 378],
			[1065, 856],
			[330, 887]
		],

		cogs: [
			{
				p:[65, 920],
				size:150,
				rotVel: defaultCog,
				rot:0
			},
			{
				p:[165, 940],
				size:75,
				rotVel: -defaultCog*2,
				h: true,
				rot:0
			},
			{
				p:[25, 830],
				size:75,
				rotVel: -defaultCog*2,
				h: true,
				rot:-Math.PI/12
			},
			{
				p:[37, 556+37],
				size:75,
				rotVel: defaultCog*1.5,
				h: true,
				rot:0
			},

			{
				p:[850, 650],
				size:100,
				rotVel: defaultCog*0.75,
				rot:0
			},


			{
				p:[50, 50],
				size:150,
				rotVel: defaultCog*-1,
				rot:0
			},

			{
				p:[1250, 50],
				size:150,
				rotVel: defaultCog*1,
				rot:0
			}
		]
	}
	
	t.camShake = 0;
	t.redOver = 0;
	t.mode = -1;
	t.fastRope = false;
	t.update = update;
	t.render = render;

	t.addParticle = addParticle;
	t.addEntity = addEntity;
	t.removeEntity = removeEntity;
	t.addPlayer = addPlayer;
	t.loadLevel = loadLevel;
	t.game = game;
	t.updateItems = updateItems;
	t.sendItemUp = sendItemUp;

	t.uploadPos = uploadPos;
	t.playerDied = playerDied;
	t.setMode = setMode;
	t.kill = kill;

	t.ui = new gameUI(t);

	t.camTarg = [400,300];
	t.cameraPos = [400,300];
	t.scaleTarg = 1;
	t.cameraScale = 1;

	var ply;

	init();

	function loadLevel(name) {
		t.col = new SvgColParse(files["collision/"+name+".svg"]);
		t.quad = new QuadTree(t.col, 50);
		t.img = files["img/"+name+".png"];

		t.entities = [];
		t.players = [];
		t.particles = [];
		t.items = [];

		for (var i=0; i<t.levelInfo.itemSpawns.length; i++) {
			var item = new itemSpawn(t, game, t.levelInfo.itemSpawns[i]);
			addEntity(item);
			t.items.push(item);
		}

		for (var i=0; i<t.levelInfo.cogs.length; i++) {
			var item = new cog(t, game, t.levelInfo.cogs[i]);
			addEntity(item);
		}

		//ply = new Player(t, game, [400, 300], false);
		//t.addPlayer(ply);
	}

	function updateItems(obj) {
		for (var i=0; i<obj.length; i++) {
			t.items[i].itemContain = obj[i];
		}
	}

	function init() {
		if (!game.musicMute) {
			music = game.ac.createBufferSource();
			music.buffer = files["sound/music.ogg"];
			music.loop = true;
			music.connect(game.outGain);
			music.start(0);
		}

		//loadLevel("lvl1");

		//for (var i=0; i<2000; i++) {
		//	addParticle({type:0, p:[Math.random()*800, Math.random()*600], v:[Math.random()*20, Math.random()*20]});
		//}
	}

	function update() {

		if (game.keyDownArray[77] != lastMM) {
			if (game.keyDownArray[77]) {
				game.musicMute = !game.musicMute;
				if (game.musicMute) {
					if (music != null) music.stop(0);
				} else if (t.mode < 2) {
					music = game.ac.createBufferSource();
					music.buffer = files["sound/music.ogg"];
					music.loop = true;
					music.connect(game.outGain);
					music.start(0);
				}
			}
			lastMM = game.keyDownArray[77];
		}
		if (game.keyDownArray[78] != lastAM) {
			if (game.keyDownArray[78]) {
				game.allMute = !game.allMute;
				game.outGain.gain.value = (game.allMute)?0:1;
			}
			lastAM = game.keyDownArray[78];
		}

		var ply;
		for (var i=0; i<t.players.length; i++) {
			if (!t.players[i].net) ply = t.players[i];
		}

		if (t.mode == 3) {
			var toKill = Math.round(Math.min(1, elapsed/30)*t.players.length);
			for (var i=0; i<toKill; i++) {
				var p = t.players[i];
				if (p.deadTimer <= 0 && p != t.winner) p.animatedDie();
			}

			if (elapsed > 45) {
				t.camTarg = [t.winner.p[0], t.winner.p[1]];
				t.scaleTarg = 2;
			} else {
				t.scaleTarg = 0.7;
				t.camTarg = [t.levelInfo.width/2, t.levelInfo.height/2];
			}
		} else if (t.mode < 2) {
			t.camTarg = [ply.p[0], ply.p[1]];
			var vel = Math.sqrt(vec2.dot(ply.v, ply.v));
			t.scaleTarg = 1.5-vel/20;
		} else {
			t.scaleTarg = 0.7;
			t.camTarg = [t.levelInfo.width/2, t.levelInfo.height/2];
		}

		t.camShake *= 0.85;
		t.redOver *= 0.9;

		for (var i=0; i<t.entities.length; i++) {
			if (t.entities[i].update(t)) t.entities.splice(i--, 1);
		}		

		for (var i=0; i<t.particles.length; i++) {
			var p = t.particles[i];
			if (pHandlers.update[p.type](t, p)) t.particles.splice(i--, 1);
		}

		t.ui.update();

		t.cameraPos[0] += (t.camTarg[0]-t.cameraPos[0])/10;
		t.cameraPos[1] += (t.camTarg[1]-t.cameraPos[1])/10;
		t.cameraScale += (t.scaleTarg*((ctx.canvas.height>600)?(ctx.canvas.height/600):1)-t.cameraScale)/20;

		//limit camera position to level bounds
		var lBound = (canvas.width/2)/t.cameraScale;
		var rBound = t.levelInfo.width-(canvas.width/2)/t.cameraScale;
		var tBound = (canvas.height/2)/t.cameraScale;
		var bBound = t.levelInfo.height-(canvas.height/2)/t.cameraScale;

		t.cameraPos[0] = Math.max(lBound, Math.min(rBound, t.cameraPos[0]));
		t.cameraPos[1] = Math.max(tBound, Math.min(bBound, t.cameraPos[1]));

		if (isNaN(t.cameraPos[0])) t.cameraPos[0] = t.camTarg[0];
		if (isNaN(t.cameraPos[1])) t.cameraPos[1] = t.camTarg[1];

		elapsed++;
	}

	function render(ctx) {
		ctx.save();

		ctx.save();
		var bgscale = Math.max(ctx.canvas.width/900, ctx.canvas.height/600);
		ctx.scale(bgscale, bgscale)
		ctx.drawImage(files["img/bg.png"], 0, 0);
		ctx.restore();

		ctx.translate(ctx.canvas.width/2, ctx.canvas.height/2);
		ctx.translate((Math.random()-0.5)*t.camShake, (Math.random()-0.5)*t.camShake);

		ctx.scale(t.cameraScale, t.cameraScale);
		ctx.translate(-t.cameraPos[0], -t.cameraPos[1]);

		ctx.save();
		ctx.scale(0.5, 0.5);
		ctx.drawImage(t.img, 0, 0);
		ctx.restore();

		//debug: draw collision

		/*ctx.lineWidth = 2;
		ctx.strokeStyle = "red";
		for (var i=0; i<t.col.lines.length; i++) {
			var l = t.col.lines[i];
			ctx.beginPath();
			ctx.moveTo(l.p1[0], l.p1[1]);
			ctx.lineTo(l.p2[0], l.p2[1]);
			ctx.stroke();
		}*/

		for (var i=0; i<t.entities.length; i++) {
			t.entities[i].render(ctx, t);
		}	

		for (var i=0; i<t.particles.length; i++) {
			var p = t.particles[i];
			pHandlers.render[p.type](ctx, t, p);
		}

		ctx.restore();

		ctx.save();
		ctx.fillStyle = "red";
		ctx.globalAlpha = t.redOver/100;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.globalAlpha = 1;
		t.ui.render(ctx);
		ctx.restore();
	}

	function addParticle(p) {
		t.particles.push(p);
	}

	function addEntity(e) {
		t.entities.push(e);
	}

	function removeEntity(e) {
		for (var i=0; i<t.entities.length; i++) {
			if (t.entities[i] == e) {
				t.entities.splice(i, 1);
				return;
			}
		}
	}

	function addPlayer(p) {
		t.entities.push(p);
		t.players.push(p);
	}

	function setMode(mode) {
		elapsed = 0;
		t.mode = mode;

		if (mode == 2) {
			if (music != null) music.stop(0);
		}
		if (mode == 3) {

			if (!game.musicMute) {
				var source = game.ac.createBufferSource();
				source.buffer = files["sound/roundEnd.ogg"];
				source.connect(game.outGain);
				source.start(0);
			}

			var greatestScore = -1;
			t.winner = null;
			for (var i=0; i<t.players.length; i++) {
				var p = t.players[i];
				if (p.score > greatestScore) {
					t.winner = p;
					greatestScore = p.score;
				}
			}
		}
		console.log("mode changed")
	}

	function kill() {
		music.stop(0);
		//stop sounds, etc.
	}

	function uploadPos(ent) {
		if (clientScene == null) return;
		clientScene.sendPacket({
			t:"p",
			d: {
				p: [ent.p[0], ent.p[1]],
				v: [ent.v[0], ent.v[1]],
				i: ent.input,
				g: ent.groundTime,
				w: ent.wallTime,
				wN:ent.wallNorm,
				u: ent.upPress,

				N: ent.ropeWep,
				R: ent.ropeHitter.saveState(),

				d: ent.deadTimer,
				h: ent.hp,
				K: ent.kills,
				a: ent.assists,
				D: ent.deaths
			}
		});
	}

	function sendItemUp(caller) {
		clientScene.sendPacket({
			t:"i",
			i:t.items.indexOf(caller)
		});
	}

	function playerDied(p, cause) {
		//t.gameUI.addKill(cause);
		clientScene.sendPacket({
			t:"x",
			c:cause,
			o:t.players.indexOf(p)
		});
	}
}