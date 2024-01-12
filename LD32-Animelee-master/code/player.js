var I_JUMP = 1;
var I_LEFT = 2;
var I_RIGHT = 4;
var I_CCW = 8;
var I_CW = 16;

function Player(scn, game, pos, net) {
	var t = this;

	var files = game.files;
	var img = files["img/player.png"];
	var imgm = files["img/playerm.png"];
	var imgf = files["img/playerf.png"];
	t.groundTime = 0;
	t.wallTime = 0;
	t.wallNorm = 0;
	t.ropeWep = 1;
	t.upPress = false;
	t.active = true;
	t.net = net;
	t.hp = 100;
	t.kills = 0;
	t.assists = 0;
	t.score = 0;
	t.deaths = 0;

	t.deadTimer = 0;

	t.p = vec2.clone(pos);
	t.v = vec2.create();

	t.update = update;
	t.damage = damage;
	t.render = render;
	t.setItem = setItem;
	t.animatedDie = animatedDie;
	t.input = {
		b: 0 //bit order: jump, left, right, ccw swing, cw swing
	};

	var lastInput = t.input.b;

	t.rAng = 0;
	t.ropeHitter = new RopeObj(scn, game, ropeObjDefs[t.ropeWep], t);
	scn.addEntity(t.ropeHitter);

	var minimumMove = 0.05;
	var queueSendPos = 60; //send position every 60 frames, or if input changes

	function readInput() {

		if (scn.mode != 1 && !(scn.mode == 3 && scn.time > 0.9)) {
			t.input.b = 0;
		} else {
			t.input.b = (game.keyDownArray[38]) | (game.keyDownArray[37] << 1) | (game.keyDownArray[39] << 2) | (game.keyDownArray[69] << 3) | (game.keyDownArray[82] << 4);
		}

		if (t.input.b != lastInput) {
			lastInput = t.input.b;
			queueSendPos = 0;
		}
	}

	function respawn() {
		playReduced("respawn_lb");
		if (scn.mode > 1) {
			t.deadTimer = 120;
			return;
		}
		setItem(1);
		t.p = vec2.clone(scn.levelInfo.respawns[Math.floor(Math.random()*scn.levelInfo.respawns.length)]);
		t.v = vec2.create();
		t.hp = 100;
	}

	function update(scn) {	
		t.score = t.kills+t.assists;
		if (!t.active) {
			if (t.ropeHitter != null) {
				scn.removeEntity(t.ropeHitter);
				t.ropeHitter = null;
			}
			return;
		}
		if (!net) {
			if (t.deadTimer > 0) {
				if (--t.deadTimer == 0) {
					//RESPAWN
					respawn();
				}
			}

			readInput();
			if (--queueSendPos <= 0) {
				queueSendPos = 60;
				scn.uploadPos(t);
			}
		}

		if (t.deadTimer > 0) return;

		t.rAng += 1;
		if (t.groundTime>0) {
			vec2.scale(t.v, t.v, 0.90);
			if (t.input.b & I_LEFT) {
				for (var i=0; i<3; i++) {
					var p = [t.p[0], t.p[1]+10]
					scn.addParticle({type:0, p:p, lp:p, v:[Math.random()*9, Math.random()*-6], t:120});
				}
				t.v[0] += -0.8;
			} else if (t.input.b & I_RIGHT) {
				for (var i=0; i<3; i++) {
					var p = [t.p[0], t.p[1]+10]
					scn.addParticle({type:0, p:p, lp:p, v:[Math.random()*-9, Math.random()*-6], t:120});
				}
				t.v[0] += 0.8;
			}

			if ((t.input.b & I_JUMP) && !t.upPress) {
				playReduced("jump_lb");
				for (var i=0; i<25; i++) {
					var p = [t.p[0], t.p[1]+10]
					scn.addParticle({type:0, p:p, lp:p, v:[Math.random()*12-6, Math.random()*-8], t:120});
				}
				t.v[1] = -10;
				t.groundTime = 0;
			}
		} else {
			vec2.scale(t.v, t.v, 0.98);
			if (t.input.b & I_LEFT) t.v[0] += -0.15;
			if (t.input.b & I_RIGHT) t.v[0] += 0.15;

			if (t.wallTime > 0) {
				if (t.input.b & I_JUMP && !t.upPress) {
					vec2.add(t.v, t.v, vec2.scale([], t.wallNorm, 5));
					t.v[1] = -6;
					t.wallTime = 0;
					playReduced("walljump_lb");

					var start = vec2.add([], t.p, vec2.scale([], t.wallNorm, 10))
					var vel = vec2.scale([], t.wallNorm, -10);
					for (var i=0; i<25; i++) {
						var p = [start[0], start[1]]
						scn.addParticle({type:0, p:p, lp:p, v:[Math.random()*vel[0], Math.random()*10-5], t:120});
					}
				}
			}
		}

		t.upPress = t.input.b & I_JUMP; //used to determine if up press is new;

		t.groundTime--;
		t.wallTime--;
		//COLLISION

		t.v[1] += GRAVITY;

		var steps = 0;
		var remainingT = 1;
		var velSeg = vec2.clone(t.v);
		var posSeg = vec2.clone(t.p);
		while (steps++ < 5 && remainingT > 0.01) {
			var result = collider.sweepEllipse(posSeg, velSeg, scn.quad.getLines(t.p), [12, 12]);
			if (result != null) {
				colResponse(posSeg, velSeg, result)

				remainingT -= result.t;
				if (remainingT > 0.01) {
					vec2.scale(velSeg, t.v, remainingT);
				}
			} else {
				vec2.add(posSeg, posSeg, velSeg);
				remainingT = 0;
			}
		}
		t.p = posSeg;

	}

	function explodeAt(op, dist, num) {
		for (var i=0; i<num; i++) {
			var p = [op[0]+Math.random()*dist-dist/2, op[1]+Math.random()*dist-dist/2];
			var col = sparkStates[Math.floor(3*Math.random())];
			scn.addParticle({type:1, p:p, t:0, 
				col:"rgb("+col[0]+","+col[1]+","+col[2]+")", 
				tv:1/15, delay:Math.random()*15, radius: Math.random()*15+15});
		}
	}

	function die(type, killer) {
		if (scn.mode == 1) t.deaths += 1;
		queueSendPos = 0;

		scn.playerDied(t, [killer, type, scn.players.indexOf(t)]);

		animatedDie();
	}

	function animatedDie() {
		scn.camShake += 10;
		playReduced("death_lb");
		t.deadTimer = 120;
		for (var i=0; i<200; i++) {
			var p = [t.p[0], t.p[1]]
			scn.addParticle({type:0, p:p, lp:p, v:[Math.random()*20-10, Math.random()*20-10], t:120});
		}
		explodeAt(t.p, 100, 15);
	}

	function damage(amount, type, killer) {
		if (t.deadTimer > 0) return;
		queueSendPos = 0;
		if (!net) scn.redOver += amount;
		t.hp -= amount;
		if (amount > 5) explodeAt(t.p, 40, 1)

		if (t.hp <= 0) {
			t.hp = 0;
			if (!net) die(type, killer);
		}
	}

	function colResponse(pos, pvel, dat) {
		var n = vec2.normalize([], dat.normal);
		var adjustPos = true;

		var proj = vec2.dot(t.v, n);
		vec2.sub(t.v, t.v, vec2.scale(vec2.create(), n, proj));

		if (adjustPos) { //move back from plane slightly
			vec3.add(pos, pos, vec3.scale(vec3.create(), pvel, dat.t));
			vec3.add(pos, vec3.scale([], n, 12+minimumMove), dat.colPoint);
		} else {
			vec3.add(pos, pos, vec3.scale(vec3.create(), pvel, dat.t));
		}

		if (Math.acos(vec2.dot([0, -1], n)) < Math.PI/3.5) {
			t.groundTime = 5;
		} else if (Math.acos(vec2.dot([0, 1], n)) < Math.PI/3.5) {
			//ceiling
		} else {
			t.wallTime = 10;
			t.wallNorm = n;
		}
	}

	function setItem(num, playSnd) {
		t.ropeWep = num;
		t.ropeHitter.setup(ropeObjDefs[num]);
		if (playSnd) playReduced("pickup_lb");
	}

	function render(ctx, scn) {
		if (!t.active || t.deadTimer>0) return;

		ctx.save()
		ctx.translate(t.p[0], t.p[1]);

		ctx.scale((t.input.b & I_LEFT)?-0.5:0.5, 0.5);
		ctx.drawImage((t.v[1]>3)?imgf:((t.input.b & (I_LEFT | I_RIGHT))?imgm:img), -20, -28);

		ctx.restore();

		ctx.textAlign = "center";
		ctx.font = "bold 14px Trebuchet MS"

		var hpView = ((100-t.hp)/100)*3;
		var sC = sparkStates[Math.floor(hpView)]
		var eC = sparkStates[Math.ceil(hpView)]
		var i = hpView%1;

		//crash fix. no idea why this happens.
		if (eC != null && sC != null) ctx.fillStyle = "rgba("+Math.round(sC[0]*(1-i)+eC[0]*i)+", "+Math.round(sC[1]*(1-i)+eC[1]*i)+", "+Math.round(sC[2]*(1-i)+eC[2]*i)+", "+(sC[3]*(1-i)+eC[3]*i)+")";

		//ctx.fillStyle = "#FFFFFF";
		ctx.strokeStyle = "#002244";
		ctx.strokeText(t.name, t.p[0], t.p[1]-18);
		ctx.fillText(t.name, t.p[0], t.p[1]-18);
		//ctx.fillText(t.hp+" HP", t.p[0], t.p[1]+15);
	}

	function playReduced(snd) {
		if (!net) {
			playSound(snd); return;
		}
		var source = game.ac.createBufferSource();
		var g = game.ac.createGain();
		g.gain.value = 0.3;
		source.buffer = files["sound/"+snd+".wav"];
		source.connect(g);
		g.connect(game.outGain);
		source.start(0);
	}

	function playSound(snd) {
		var source = game.ac.createBufferSource();
		source.buffer = files["sound/"+snd+".wav"];
		source.connect(game.outGain);
		source.start(0);
	}
}