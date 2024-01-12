var WHALE_ANG_LIM = Math.PI/20;
var WHALE_ANG_K = 0.003;
var CAT_ANG_K = 0.001;
var CROC_ANG_K = 0.005;
var PHEEB_ANG_K = 0.002;
var ROPE_UPDATES = 15;

var animals = [];

function genAnimalImg(game) {
	for (var j=0; j<ropeObjDefs.length; j++) {
		var r = ropeObjDefs[j];
		var img = game.files["img/"+r.name+".png"];

		if (img != null) {
			var animal = [];
			var imgPos = 0;
			for (var i=0; i<r.segments.length; i++) {
				var seg = r.segments[i];
				if (i != 0) imgPos += seg.dist*2;
				var drawC = document.createElement("canvas");
				var angClip = (seg.angClip == null)?r.angClip:seg.angClip;
				var downOff = (seg.downOff == null)?0:seg.downOff;
				var ellipseMult = (seg.ellipseMult == null)?1:seg.ellipseMult;
				var size = seg.colSize*4+angClip*2;
				drawC.width = size;
				drawC.height = size*ellipseMult;
				var ctx = drawC.getContext("2d");

				ctx.scale(1, ellipseMult);

				ctx.beginPath();
				ctx.arc(size/2, size/2, size/2, 0, Math.PI*2);
				ctx.clip();

				var x = imgPos-size/2;
				var y = (img.height/2-(size*ellipseMult)/2)+(downOff*2);
				var xsize = Math.max(0, (x<0)?size+x:size);
				var ysize = Math.max(0, (y<0)?size*ellipseMult+y:size*ellipseMult);
				x = Math.max(0, x);
				y = Math.max(0, y);

				if (x+xsize > img.width) xsize = img.width-x;
				if (y+ysize > img.height) ysize = img.height-y;

				ctx.drawImage(img, x, y, xsize, ysize, 0, 0, size, size); 
				animal.push(drawC);
			}
			animals.push(animal);
		} else {
			animals.push(null)
		}
	}
}

var ropeObjDefs = [
	{
		n:0,
		name:"Whale",
		k:0.04,
		slamVel:0.00035,
		dmgMul:1.2,
		angClip:2,
		segments: [
			{dist: 12, colSize: 1.5, angleK: 0},
			{dist: 3, colSize: 2.5, angleK: WHALE_ANG_K/3.3, ellipseMult:10},
			{dist: 3.5, colSize: 4, angleK: WHALE_ANG_K/3},
			{dist: 5, colSize: 6, angleK: WHALE_ANG_K/2.5},
			{dist: 7, colSize: 9, angleK: WHALE_ANG_K/2},
			{dist: 7.5, colSize: 11.5, angleK: WHALE_ANG_K/1.5},
			{dist: 8, colSize: 13.5, angleK: WHALE_ANG_K},
			{dist: 7, colSize: 14.5, angleK: WHALE_ANG_K, ellipseMult:1.75, downOff: -5},
			{dist: 6, colSize: 14.5, angleK: WHALE_ANG_K, ellipseMult:1.5, downOff: 4},
			{dist: 6, colSize: 14.5, angleK: WHALE_ANG_K},
			{dist: 5.5, colSize: 13.5, angleK: WHALE_ANG_K},
			{dist: 5, colSize: 12.5, angleK: WHALE_ANG_K},
			{dist: 4, colSize: 10.5, angleK: WHALE_ANG_K},
			{dist: 4, colSize: 7.5, angleK: WHALE_ANG_K},
		]
	},

	{
		n:1,
		name:"Cat",
		k:0.03,
		dmgMul:2.5,
		slamVel: 0.001,
		angClip:2,
		segments: [
			{dist: 12, colSize: 1.5, angleK: 0},
			{dist: 2, colSize: 1.5, angleK: CAT_ANG_K},	
			{dist: 2, colSize: 1.5, angleK: CAT_ANG_K},
			{dist: 2, colSize: 1.5, angleK: CAT_ANG_K},
			{dist: 2, colSize: 1.5, angleK: CAT_ANG_K},
			{dist: 2, colSize: 1.5, angleK: CAT_ANG_K},
			{dist: 2, colSize: 1.5, angleK: CAT_ANG_K},
			{dist: 6, colSize: 7, angleK: CAT_ANG_K, angClip:4},
			{dist: 10, colSize: 4, angleK: CAT_ANG_K*3, angClip:3},
		]
	},

	{
		n:2,
		name:"Croc",
		k:0.07,
		slamVel: 0.0007,
		dmgMul:2,
		angClip:2,
		segments: [
			{dist: 12, colSize: 0.75, angleK: 0},
			{dist: 1, colSize: 1, angleK: CROC_ANG_K},
			{dist: 1, colSize: 1.25, angleK: CROC_ANG_K},
			{dist: 2, colSize: 1.5, angleK: CROC_ANG_K},
			{dist: 2, colSize: 2, angleK: CROC_ANG_K},
			{dist: 2.5, colSize: 2.5, angleK: CROC_ANG_K},
			{dist: 3, colSize: 3, angleK: CROC_ANG_K},
			{dist: 3.5, colSize: 3.5, angleK: CROC_ANG_K},
			{dist: 4, colSize: 4, angleK: CROC_ANG_K},
			{dist: 4.5, colSize: 4.5, angleK: CROC_ANG_K},
			{dist: 5, colSize: 5, angleK: CROC_ANG_K},
			{dist: 5.5, colSize: 5.5, angleK: CROC_ANG_K, angClip:4, downOff:3},
			{dist: 6, colSize: 6, angleK: CROC_ANG_K},
			{dist: 6.25, colSize: 6.25, angleK: CROC_ANG_K},
			{dist: 6, colSize: 6, angleK: CROC_ANG_K},
			{dist: 4, colSize: 5, angleK: CROC_ANG_K},
			{dist: 4, colSize: 4.5, angleK: CROC_ANG_K, angClip:4, downOff:3},
			{dist: 4, colSize: 4, angleK: CROC_ANG_K},
			{dist: 3, colSize: 3, angleK: CROC_ANG_K},
			{dist: 3, colSize: 3, angleK: CROC_ANG_K},
			{dist: 3, colSize: 3, angleK: CROC_ANG_K},
			{dist: 3, colSize: 3, angleK: CROC_ANG_K},
			{dist: 2.5, colSize: 2.5, angleK: CROC_ANG_K}
		]
	},

	{
		n:3,
		name:"Phoebe",
		k:0.04,
		slamVel:0.00035,
		dmgMul:1,
		angClip:2,
		segments: [
			{dist: 12, colSize: 3.5, angleK: 0},
			{dist: 4, colSize: 3.5, angleK: PHEEB_ANG_K/3},
			{dist: 4, colSize: 3.5, angleK: PHEEB_ANG_K/3},
			{dist: 4, colSize: 3.5, angleK: PHEEB_ANG_K/3},
			{dist: 4, colSize: 3.5, angleK: PHEEB_ANG_K/3},
			{dist: 4, colSize: 3.5, angleK: PHEEB_ANG_K/3},
			{dist: 4, colSize: 3.5, angleK: PHEEB_ANG_K/3},
			{dist: 4, colSize: 3.5, angleK: PHEEB_ANG_K/3},

			{dist: 14, colSize: 16.5, angleK: PHEEB_ANG_K/2, angClip:9, downOff:6},
			{dist: 7.5, colSize: 18, angleK: PHEEB_ANG_K/2},
			{dist: 8, colSize: 19, angleK: PHEEB_ANG_K/1.75},
			{dist: 7, colSize: 18, angleK: PHEEB_ANG_K/1.5},
			{dist: 7, colSize: 17, angleK: PHEEB_ANG_K/1.25},
			{dist: 7, colSize: 15, angleK: PHEEB_ANG_K, angClip:11, downOff:5},
			{dist: 8, colSize: 15, angleK: PHEEB_ANG_K},
			{dist: 8, colSize: 15, angleK: PHEEB_ANG_K},
		]
	},

	{
		n:4,
		name:"Snake",
		k:0.07,
		slamVel:0.001,
		dmgMul:2,
		angClip:2,
		segments: [
			{dist: 12, colSize: 1, angleK: 0},
			{dist: 1, colSize: 1, angleK: PHEEB_ANG_K},
			{dist: 1, colSize: 1, angleK: PHEEB_ANG_K},
			{dist: 1, colSize: 1, angleK: PHEEB_ANG_K},
			{dist: 2.5, colSize: 1.5, angleK: PHEEB_ANG_K},
			{dist: 2, colSize: 1.5, angleK: PHEEB_ANG_K},
			{dist: 2, colSize: 1.5, angleK: PHEEB_ANG_K},
			{dist: 3, colSize: 2.5, angleK: PHEEB_ANG_K},
			{dist: 4, colSize: 2.5, angleK: PHEEB_ANG_K},
			{dist: 4, colSize: 2.5, angleK: PHEEB_ANG_K},
			{dist: 5, colSize: 3.5, angleK: PHEEB_ANG_K},
			{dist: 5, colSize: 3.5, angleK: PHEEB_ANG_K},
			{dist: 5, colSize: 3.5, angleK: PHEEB_ANG_K},
			{dist: 5, colSize: 3.5, angleK: PHEEB_ANG_K},
			{dist: 5, colSize: 3.5, angleK: PHEEB_ANG_K},
			{dist: 5, colSize: 3.5, angleK: PHEEB_ANG_K},
			{dist: 5, colSize: 3.5, angleK: PHEEB_ANG_K},
			{dist: 5, colSize: 3.5, angleK: PHEEB_ANG_K},
			{dist: 4, colSize: 3.25, angleK: PHEEB_ANG_K},
			{dist: 4, colSize: 3.11, angleK: PHEEB_ANG_K},
			{dist: 4, colSize: 3, angleK: PHEEB_ANG_K},
			{dist: 4, colSize: 3.5, angleK: PHEEB_ANG_K},
			{dist: 4, colSize: 1, angleK: PHEEB_ANG_K},
			{dist: 4, colSize: 1, angleK: PHEEB_ANG_K},
			{dist: 4, colSize: 1, angleK: PHEEB_ANG_K},
			{dist: 4, colSize: 1, angleK: PHEEB_ANG_K}
			]
	}
]

function RopeObj(scn, game, def, owner) {
	if (animals.length == 0) genAnimalImg(game);
	var def = def;
	var t = this;
	t.update = update;
	t.render = render;

	var impactCD = 0;

	t.loadState = loadState;
	t.saveState = saveState;
	t.setup = setup;

	t.slamDir = 0;

	var minimumMove = 0.05;

	var parts = [];
	setup(def);

	function setup(newDef) {
		parts = [];
		var last = owner;
		for (var i=0; i<newDef.segments.length; i++) {
			var nPart = {
				parent: last, //MUST have position p, angle rAng and vel v.
				p: vec2.clone(last.p),
				v: vec2.create(),
				rAng: last.rAng,
				def: newDef.segments[i],
				rseg: true
			};
			last.rChild = nPart;
			last = nPart;
			parts.push(nPart);
		}
		def = newDef;
	}

	function update() {
		if (scn.fastRope) {
			frupdate();
			return;
		}
		if (!owner.active || owner.deadTimer > 0) return;

		if (owner.input.b & I_CCW) t.slamDir = 1;
		else if (owner.input.b & I_CW) t.slamDir = -1;
		else t.slamDir = 0;

		for (var i=0; i<ROPE_UPDATES; i++) ropeUpdate();

		for (var i=0; i<parts.length; i++) {
			var e = parts[i];

			if (e.lp != null) {
				e.rVel = vec2.sub([], e.p, e.lp);
				vec2.sub(e.rVel, e.rVel, owner.v);
				var velMag = Math.sqrt(vec2.dot(e.rVel, e.rVel));
				if (velMag > 5 && Math.abs(t.slamDir)>0.9) {
					for (var j=0; j<scn.players.length; j++) {
						var p = scn.players[j];
						if (!p.active || p.deadTimer > 0 || p == owner) continue;
						if (vec2.dist(e.p, p.p) < e.def.colSize+12) {
							//colliding with this player
							p.damage(velMag*e.def.colSize*0.02*def.dmgMul, def.name, scn.players.indexOf(owner));
							var norm = vec2.normalize([], vec2.sub([], p.p, e.p));
							vec2.add(p.v, p.v, vec2.scale(norm, norm, velMag*e.def.colSize*0.01))
						}
					}
					if (e.scrS) {
						if (impactCD <= 0 && (velMag*e.def.colSize*0.04 > 2)) {
							playSound("impact_lb");
							impactCD = 5;
						}
						scn.camShake += Math.min(3, velMag*e.def.colSize*0.04);
					}
					
				}
				e.lp[0] = e.p[0];
				e.lp[1] = e.p[1];
			} else {
				e.lp = vec2.clone(e.p);
			}
			e.scrS = false;
			
		}

		impactCD--;
	}

	function frupdate() {
		if (!owner.active || owner.deadTimer > 0) return;

		if (owner.input.b & I_CCW) t.slamDir = 1;
		else if (owner.input.b & I_CW) t.slamDir = -1;
		else t.slamDir = 0;

		for (var i=0; i<parts.length; i++) {
			parts[i].nP = [parts[i].p[0], parts[i].p[1]];
		}
		owner.nP = owner.p;

		for (var i=0; i<ROPE_UPDATES; i++) frRopeUpdate();

		for (var i=0; i<parts.length; i++) {

			//FAST ROPE - only do collision once per frame
			//added post compo to fix games with many players

			var e = parts[i];

			var steps = 0;
			var remainingT = 1;
			velSeg = vec2.sub([], e.nP, e.p);
			posSeg = vec2.clone(e.p);
			while (steps++ < 5 && remainingT > 0.01) {
				var result = collider.sweepEllipse(posSeg, velSeg, scn.quad.getLines(e.p), [e.def.colSize, e.def.colSize]);
				if (result != null) {
					frcolResponse(posSeg, velSeg, result, e);

					remainingT -= result.t;
					if (remainingT > 0.01) {
						vec2.scale(velSeg, e.v, remainingT*ROPE_UPDATES);
					}
				} else {
					vec2.add(posSeg, posSeg, velSeg);
					remainingT = 0;
				}
			}
			e.p[0] = posSeg[0]; e.p[1] = posSeg[1];

			if (vec2.dist(e.p, e.parent.p) > Math.max(3,e.def.dist)*5) {
				//we got a problem
				//move to parent
				e.p[0] = e.parent.p[0];
				e.p[1] = e.parent.p[1];
				e.v[0] = 0;
				e.v[1] = 0;
				dist = 0;
			}


			//END FAST ROPE

			
			if (e.lp != null) {
				e.rVel = vec2.sub([], e.p, e.lp);
				vec2.sub(e.rVel, e.rVel, owner.v);
				var velMag = Math.sqrt(vec2.dot(e.rVel, e.rVel));
				if (velMag > 5 && Math.abs(t.slamDir)>0.9) {
					for (var j=0; j<scn.players.length; j++) {
						var p = scn.players[j];
						if (!p.active || p.deadTimer > 0 || p == owner) continue;
						if (vec2.dist(e.p, p.p) < e.def.colSize+12) {
							//colliding with this player
							p.damage(velMag*e.def.colSize*0.02*def.dmgMul, def.name, scn.players.indexOf(owner));
							var norm = vec2.normalize([], vec2.sub([], p.p, e.p));
							vec2.add(p.v, p.v, vec2.scale(norm, norm, velMag*e.def.colSize*0.01))
						}
					}
					if (e.scrS) {
						if (impactCD <= 0 && (velMag*e.def.colSize*0.04 > 2)) {
							playSound("impact_lb");
							impactCD = 5;
						}
						scn.camShake += Math.min(3, velMag*e.def.colSize*0.04);
					}
					
				}
				e.lp[0] = e.p[0];
				e.lp[1] = e.p[1];
			} else {
				e.lp = vec2.clone(e.p);
			}
			e.scrS = false;
		}

		impactCD--;
	}

	//var some vectors out here for performance reasons
	var tNorm = vec2.create();
	var dummy = vec2.create();
	var posSeg = vec2.create();
	var velSeg = vec2.create();

	function ropeUpdate() {
		//rope needs to:
		// - enforce distance constraints via tight rope
		// - enforce angle constraints
		var totalDist = 0;
		var totalAngle = [0, 0];

		for (var i=0; i<parts.length; i++) {
			var e = parts[i];
			//determine distance, try to fix distance with velocity change
			var dist = vec2.dist(e.p, e.parent.p);

			if (dist > Math.max(3,e.def.dist)*5) {
				//we got a problem
				//move to parent
				e.p[0] = e.parent.p[0];
				e.p[1] = e.parent.p[1];
				e.v[0] = 0;
				e.v[1] = 0;
				dist = 0;
			}
			totalDist += e.def.dist;
			totalDist *= 0.9;
			//get normal to thrust on
			if (dist == 0) {
				tNorm[0] = -1;
				tNorm[1] = 0;
			} else {
				vec2.sub(tNorm, e.parent.p, e.p);
				vec2.normalize(tNorm, tNorm);
			};
			//thrust part 
			vec2.add(e.v, e.v, vec2.scale(dummy, tNorm, (dist-e.def.dist)*def.k));
			if (e.parent.rseg) vec2.add(e.parent.v, e.parent.v, vec2.scale(dummy, tNorm, (dist-e.def.dist)*def.k/-1));

			//ROTATION
			//get angle difference

			var angle = Math.atan2(e.parent.p[1]-e.p[1], e.p[0]-e.parent.p[0]);
			var angleDiff = dirDiff(e.parent.rAng, angle);

			var thrustAng = angle+Math.PI/2;
			var rotThrust = [Math.cos(thrustAng), -Math.sin(thrustAng)];
			vec2.add(totalAngle, totalAngle, rotThrust);
			vec2.scale(rotThrust, rotThrust, e.def.dist*angleDiff*e.def.angleK);
			vec2.add(e.v, e.v, rotThrust); 

			//rotation slam
			vec2.normalize(rotThrust, totalAngle);
			vec2.scale(rotThrust, rotThrust, totalDist*def.slamVel*t.slamDir);
			vec2.add(e.v, e.v, rotThrust); 

			vec2.scale(e.v, e.v, 0.98);
			//apply gravity (needs to be modified to fit finer timestep)
			e.v[1] += (GRAVITY/ROPE_UPDATES)/4;

			//PHYSICS
			var steps = 0;
			var remainingT = 1;
			velSeg[0] = e.v[0]; velSeg[1] = e.v[1];
			posSeg[0] = e.p[0]; posSeg[1] = e.p[1];
			while (steps++ < 5 && remainingT > 0.01) {
				var result = collider.sweepEllipse(posSeg, velSeg, scn.quad.getLines(e.p), [e.def.colSize, e.def.colSize]);
				if (result != null) {
					colResponse(posSeg, velSeg, result, e);

					remainingT -= result.t;
					if (remainingT > 0.01) {
						vec2.scale(velSeg, e.v, remainingT);
					}
				} else {
					vec2.add(posSeg, posSeg, velSeg);
					remainingT = 0;
				}
			}
			e.p[0] = posSeg[0]; e.p[1] = posSeg[1];

			e.rAng = Math.atan2(e.parent.p[1]-e.p[1], e.p[0]-e.parent.p[0]);

		}
		firstR = false;
	}

	function frRopeUpdate() {
		//rope needs to:
		// - enforce distance constraints via tight rope
		// - enforce angle constraints
		var totalDist = 0;
		var totalAngle = [0, 0];

		for (var i=0; i<parts.length; i++) {
			var e = parts[i];
			//determine distance, try to fix distance with velocity change
			var dist = vec2.dist(e.nP, e.parent.nP);

			totalDist += e.def.dist;
			totalDist *= 0.9;
			//get normal to thrust on
			if (dist == 0) {
				tNorm[0] = -1;
				tNorm[1] = 0;
			} else {
				vec2.sub(tNorm, e.parent.nP, e.nP);
				vec2.normalize(tNorm, tNorm);
			};
			//thrust part 
			vec2.add(e.v, e.v, vec2.scale(dummy, tNorm, (dist-e.def.dist)*def.k));
			if (e.parent.rseg) vec2.add(e.parent.v, e.parent.v, vec2.scale(dummy, tNorm, (dist-e.def.dist)*def.k/-1));

			//ROTATION
			//get angle difference

			var angle = Math.atan2(e.parent.nP[1]-e.nP[1], e.nP[0]-e.parent.nP[0]);
			var angleDiff = dirDiff(e.parent.rAng, angle);

			var thrustAng = angle+Math.PI/2;
			var rotThrust = [Math.cos(thrustAng), -Math.sin(thrustAng)];
			vec2.add(totalAngle, totalAngle, rotThrust);
			vec2.scale(rotThrust, rotThrust, e.def.dist*angleDiff*e.def.angleK);
			vec2.add(e.v, e.v, rotThrust); 

			//rotation slam
			vec2.normalize(rotThrust, totalAngle);
			vec2.scale(rotThrust, rotThrust, totalDist*def.slamVel*t.slamDir);
			vec2.add(e.v, e.v, rotThrust); 

			vec2.scale(e.v, e.v, 0.98);
			//apply gravity (needs to be modified to fit finer timestep)
			e.v[1] += (GRAVITY/ROPE_UPDATES)/4;

			vec2.add(e.nP, e.nP, e.v);
			e.rAng = Math.atan2(e.parent.nP[1]-e.nP[1], e.nP[0]-e.parent.nP[0]);

		}
		firstR = false;
	}

	function fixDir(dir) {
		return posMod(dir, Math.PI*2);
	}

	function dirDiff(dir1, dir2) {
		var d = fixDir(dir1-dir2);
		return (d>Math.PI)?(-2*Math.PI+d):d;
	}

	function posMod(i, n) {
		return (i % n + n) % n;
	}

	function colResponse(pos, pvel, dat, e) {
		var n = vec2.normalize(dat.normal, dat.normal);
		//var adjustPos = true;

		var proj = vec2.dot(e.v, n);
		vec2.sub(e.v, e.v, vec2.scale(vec2.create(), n, proj));

		var effect = Math.abs(proj)*e.def.colSize*0.08;
		if (effect > 0.06) e.scrS = true;

		//if (adjustPos) { //move back from plane slightly
			vec3.add(pos, pos, vec3.scale(vec3.create(), pvel, dat.t));
			vec3.add(pos, vec3.scale([], n, e.def.colSize+minimumMove), dat.colPoint);
		//} else {
		//	vec3.add(pos, pos, vec3.scale(vec3.create(), pvel, dat.t));
		//}
	}

	function frcolResponse(pos, pvel, dat, e) {
		var n = vec2.normalize(dat.normal, dat.normal);

		var proj = vec2.dot(pvel, n);
		var newV = vec2.sub(e.v, pvel, vec2.scale(vec2.create(), n, proj));
		vec2.scale(e.v, e.v, 1/ROPE_UPDATES);


		var effect = Math.abs(proj/ROPE_UPDATES)*e.def.colSize*0.08;
		if (effect > 0.06) e.scrS = true;

		vec3.add(pos, pos, vec3.scale(vec3.create(), pvel, dat.t));
		vec3.add(pos, vec3.scale([], n, e.def.colSize+minimumMove), dat.colPoint);

	}

	function render(ctx, scn) {
		if (!owner.active || owner.deadTimer > 0) return;
		ctx.fillStyle = "#0080FF";

		var imgs = animals[def.n];
		//var img = game.files["img/"+def.name+".png"];

		if (imgs == null) {
			for (var i=0; i<parts.length; i++) {
				ctx.beginPath();
				var e = parts[i];
				ctx.arc(e.p[0], e.p[1], e.def.colSize, 0, Math.PI*2);
				ctx.fill();
			}
		} else {
			//these are double res btw
			var imgPos = 0;
			for (var i=0; i<parts.length; i++) {
				var img = imgs[i];
				ctx.save();
				var e = parts[i];
				//if (i != 0) imgPos += e.def.dist;

				ctx.translate(e.p[0], e.p[1]);
				ctx.rotate(-e.rAng);
				ctx.scale(0.5, 0.5);

				var downOff = (e.def.downOff == null)?0:e.def.downOff;
				ctx.drawImage(img, -img.width/2, (-img.height/2)+downOff*2);

				//var width = e.def.colSize*2+4

				//ctx.drawImage(img, Math.max(0, (imgPos-width/2)*2), 0, width*2, img.height, -width/2, -img.height/4, width, img.height/2); 

				ctx.restore();
			}
			
		}

		//fdebugger;

	}

	function loadState(defNum, state) {
		parts = state;
		def = ropeObjDefs[defNum];
		var last = owner;
		for (var i=0; i<parts.length; i++) {
			var p = parts[i];
			if (i != 0) last.rChild = p;
			p.def = def.segments[i];
			p.parent = last;
			p.lp = vec2.clone(p.p);
			p.rseg = true;
			last = p;
		}
	}

	function saveState() {
		var copy = [];
		for (var i=0; i<parts.length; i++) {
			var p = parts[i];
			copy.push({
				v: p.v,
				p: p.p,
				rAng: p.rAng
				})
		}
		return copy;
	}

	function playReduced(snd) {
		if (!owner.net) {
			playSound(snd); return;
		}
		var source = game.ac.createBufferSource();
		var g = game.ac.createGain();
		g.gain.value = 0.5;
		source.buffer = game.files["sound/"+snd+".wav"];
		source.connect(g);
		g.connect(game.outGain);
		source.start(0);
	}

	function playSound(snd) {
		var source = game.ac.createBufferSource();
		source.buffer = game.files["sound/"+snd+".wav"];
		source.connect(game.outGain);
		source.start(0);
	}
}