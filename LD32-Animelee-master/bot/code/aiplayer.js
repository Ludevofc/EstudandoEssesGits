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
			runAI();
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
		findLastWaypoint();
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

		/*if (t.nextWaypoint != null) {
			ctx.beginPath();
			ctx.moveTo(t.p[0], t.p[1]);
			ctx.lineTo(t.nextWaypoint.p[0], t.nextWaypoint.p[1]);
			ctx.strokeStyle = "red";
			ctx.lineWidth = 3;
			ctx.stroke();
		}*/
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

	//AI ROUTINES

	t.nextWaypoint = null;
	t.lastWaypoint = null;
	t.wayDir = null;
	t.wayTimer = 0;
	t.wayJumped = false;
	t.jumpCount = 0;

	t.aiMode = "n"; //"n": random move, "t": target player, "i": target item
	t.aiTarget = null;

	function findLastWaypoint() {
		var closest = getWaypointClosestTo(t.p);
		t.nextWaypoint = {
			p: closest.p,
			wp: closest,
			type: "n"
		}
		gotoNextWaypoint();
	}

	function getWaypointClosestTo(pos) {
		var closest = AIwaypoints[0];
		var closestD = Infinity;
		//if we're lost, find where we are right now.
		for (var i=1; i<AIwaypoints.length; i++) {
			var p = AIwaypoints[i];
			var dist = vec2.dist(p.p, pos);
			if (dist<closestD) {
				closestD = dist;
				closest = p;
			}
		}
		return closest;
	}

	function gotoNextWaypoint() {
		var hitWay = t.nextWaypoint.wp;

		var pathFind = null;

		var target = (t.aiMode == "n")?null:t.aiTarget;
		if (target != null) pathFind = AStarPathfind(hitWay, getWaypointClosestTo(target.p));

		//
		var next;
		if (pathFind == null) {
			var selection = [];
			for (var i=0; i<hitWay.con.length; i++) {
				if (hitWay.con[i] != t.lastWaypoint) selection.push(hitWay.con[i]);
			}
			if (selection.length == 0) selection.push(t.lastWaypoint); //A B O U T T U R N

			next = selection[Math.floor(Math.random()*selection.length)];
		} else {
			next = pathFind;
		}

		var nextWp = AIwaypoints[next.target];
		t.nextWaypoint = {
			p: nextWp.p,
			wp: nextWp,
			type: next.type,
			dir: next.dir,
			allowance: next.allowance,
			sameSide: next.sameSide
		}

		setupWaypoint();
		t.lastWaypoint = hitWay;
	}

	function setupWaypoint() {
		t.wayDir = t.nextWaypoint.dir;
		t.wayTimer = 0;
		t.wayJumped = false;
		t.jumpCount = 0;
	}

	function runAI() {

		decideWhatToDo();

		if (t.nextWaypoint == null) findLastWaypoint();
		var w = t.nextWaypoint;
		t.input.b = 0;
		var diff = w.p[0]-t.p[0];
		switch (w.type) {
			case "w":
				var sameSide = (w.sameSide == null)?1:w.sameSide;
				if (diff*w.dir*sameSide > 0) {
					t.wayJumped = false;
					t.wayDir = w.dir;
				}
				if (t.wayDir > 0) t.input.b |= I_RIGHT;
				else t.input.b |= I_LEFT;
				var allowance = (w.allowance == null)?3:w.allowance;
				if (t.wallTime > 0) { 
					t.input.b |= I_JUMP; 
					t.wayDir *= -1; 
				} else if ((!t.wayJumped) && (t.groundTime > 0) && (w.dir*t.v[0]>allowance)) {
					t.input.b |= I_JUMP; 
					t.wayJumped = true;
				}

				if (t.p[1] > t.lastWaypoint.p[1]+40) {
					//uh...
					w.type = "f";
				} else if ((t.p[1] < w.p[1]) && ((t.p[0]-w.p[0])*w.dir)<0) {
					//we're at the top, success
					gotoNextWaypoint();
				}

				break;
			case "j":
				if (((!t.wayJumped)||w.p[1]-t.p[1]<-10) && (Math.min(1, Math.max(-1, diff))*t.v[0]>1) && (t.groundTime > 0)) {
					if (++t.jumpCount > 2) w.type = "f";
					else t.input.b |= I_JUMP; 
					t.wayJumped = true;
				}
			case "n":
				if (w.p[1]-t.p[1] > 50) {
					//special handling for falling onto things
					var forceInput = (Math.floor(Math.random()*3) == 0);
					if (diff > 40 || (forceInput && diff > 20 && t.v[0] < 0)) t.input.b |= I_RIGHT;
					else if (diff < -40 || (forceInput && diff < -20 && t.v[0] > 0)) t.input.b |= I_LEFT;
					else {
						//we're on top of it, reverse our direction
						if (t.v[0] > 0) t.input.b |= I_LEFT;
						if (t.v[0] < 0) t.input.b |= I_RIGHT;
					}
				} else {
					//if no collision, move to left or right
					//divide into segments of 50
					var hit = false;
					var dist = vec2.dist(w.p, t.p);
					var norm = vec2.sub([], w.p, t.p)
					vec2.normalize(norm, norm);
					var posSeg = [t.p[0], t.p[1]];

					for (var remainD=dist; remainD>0; remainD -= 50) {
						var velSeg = vec2.scale([], norm, Math.min(50, remainD));
						var result = collider.raycast(posSeg, velSeg, scn.quad.getLines(posSeg));
						if (result != null) {
							hit = true;
							break;
						}
						vec2.add(posSeg, posSeg, velSeg);
					}

					if ((!hit) || w.type == "m") {
						if (diff>0) t.input.b |= I_RIGHT;
						else t.input.b |= I_LEFT;
					} else {
						if (t.groundTime>0) {
							if (w.type=="m" || (Math.min(1, Math.max(-1, diff))*t.v[0]>1)) {
								if (++t.jumpCount > 2) w.type = "f";
								else t.input.b |= I_JUMP;
							} else {
								if (diff>0) t.input.b |= I_RIGHT;
								else t.input.b |= I_LEFT;
							}
						}
					}

					if (w.p[1]-t.p[1] > -10 && (Math.abs(diff) < 10)) {
						gotoNextWaypoint();
					} //reasonably on the waypoint
				}
				break;
			case "f": //hit the ground and reevaluate where we are
				if (t.groundTime>0) findLastWaypoint();
			default: 
				debugger;
		}

		//slam nearby enemies with items

		var nearest = null;
		var nearestD = Infinity;
		for (var i=0; i<scn.players.length; i++) {
			var p = scn.players[i];
			if ((p == t) || (!p.active) || p.deadTimer > 0) continue;
			var pd = vec2.dist(p.p, t.p);
			if (pd < nearestD) {
				nearestD = pd;
				nearest = p;
			}
		}

		if (nearestD < 150) {
			var targ = (t.aiMode == "t")?t.aiTarget:nearest;
			var dist = targ.p[0]-p.p[0];

			if (dist>0) t.input.b |= I_CW;
			else t.input.b |= I_CCW;
		}

		t.wayTimer++;
		if (t.wayTimer > 240) {
			w.type = "f";
		}
	}

	function AStarPathfind(from, to) {
		//we only need the first node on the way there
		//inefficient but allows us to dynamically change where we're going if the
		//point to move to changes (eg. player)

		var closedSet = []; //waypoint numbers
		var openSet = [];
		//im literally laughin at how unoptimized this is
		//sorry gethin
		var gScore = []; //map from point>gscore
		var fScore = []; //map from point>fscore
		var parents = []; //map from point>parent id

		openSet.push(from.i);
		gScore[from.i] = 0;
		fScore[from.i] = vec2.dist(from.p, to.p);

		while (openSet.length > 0) {
			var current = openSet.shift();
			if (current == to.i) {
				//we done
				var next = current;
				while (current != from.i) {
					next = current;
					current = parents[current];
				}
				//find path from current to next
				for (var i=0; i<from.con.length; i++) {
					if (from.con[i].target == next) return from.con[i];
				}
				return null;
			}

			closedSet.push(current);

			var elem = AIwaypoints[current];
			for (var i=0; i<elem.con.length; i++) {
				var cn = elem.con[i].target;
				if (closedSet.indexOf(cn) != -1) continue;
				var cElem = AIwaypoints[cn];
				var gFromCur = gScore[current] + vec2.dist(elem.p, cElem.p);
				var openInd = openSet.indexOf(cn);
				var newcomer = (openInd == -1);
				if (newcomer || gFromCur<gScore[cn]) {
					parents[cn] = current;
					gScore[cn] = gFromCur;
					fScore[cn] = gFromCur + vec2.dist(cElem.p, to.p);
					if (newcomer) AStarSortedInsert(openSet, fScore, cn);
					else {
						openSet.splice(openInd, 1);
						AStarSortedInsert(openSet, fScore, cn);
					}
				}
			}
		}
	}

	function AStarSortedInsert(set, fScore, n) {
		var myScore = fScore[n];
		for (var i=0; i<set.length; i++) {
			if (myScore < fScore[set[i]]) {
				set.splice(i, 0, n);
				return;
			}
		}
		set.push(n);
	}

	function decideWhatToDo() {
		if (t.aiMode != "i") {
			if ((t.ropeWep == 1) || Math.floor(Math.random()*60*7)==0) {
				//cat or randomly want a better weapon
				var bestWep = t.ropeWep;
				var bestInd = itemPref.indexOf(bestWep);
				var bestICont = null;
				for (var i=0; i<scn.items.length; i++) {
					var item = scn.items[i];
					if (item.itemContain == -1) continue
					var ind = itemPref.indexOf(item.itemContain);
					if (ind > bestInd) {
						bestWep = item.itemContain;
						bestInd = ind;
						bestICont = item;
					}
				}

				if (bestICont != null) {
					t.aiMode = "i";
					t.aiTarget = bestICont;
				}
			}
		}

		switch (t.aiMode) {
			case "t":
				if (!t.aiTarget.active) t.aiMode = "m";
			case "n": //normal or fallthrough. Randomly start following a player
				if (Math.floor(Math.random()*((t.aiMode == "n")?10:(60*10))) == 0) {

					var ply = [];
					for (var i=0; i<scn.players.length; i++) {
						var p = scn.players[i];
						if (t != p && p.active && p.deadTimer<=0) {
							ply.push(p);
						}
					}

					if (ply.length > 0) {
						t.aiTarget = ply[Math.floor(Math.random()*ply.length)];
						t.aiMode = "t";
					}
				}
				break;
			case "i":
				if (t.aiTarget.itemContain == -1) t.aiMode = "n";
				break;
		}
	}

	//worst to best
	var itemPref = [
		1, 4, 2, 0, 3
	]
}