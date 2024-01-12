//plant

var ABILITY_CODE_SUCCESS = 0;
var ABILITY_CODE_BUSY = 1;
var ABILITY_CODE_STUNNED = 2;
var ABILITY_CODE_COOLDOWN = 3;


function plant(scene, position, controller, abilities) {
	var t = this;
	var scene = scene;
	var res = scene.res;

	var cont = controller;

	t.init = init;
	t.update = update;
	t.render = render;
	t.scene = scene;

	t.p = position;

	//public functions
	t.damage = damage;
	t.useAbility = useAbility;
	t.inflictBuff = inflictBuff;

	//public paramaters
	t.growth = 2500; //scale of 0-10000, should be integer.
	//max grow height is 272*2 px
	t.buffs = []; 
	t.abilities = abilities;

	t.expression = "normal";

	var osc = 0;
	var osc2 = 0;

	t.attackCurve = 0;
	t.wobbleV = 0;
	t.wobble = 0;

	t.activeAbility = null;
	t.abilTime = 0;
	t.abilityCooldowns = [0,0,7*60,14*60,22*60,30*60]
	t.cdMax = [0,0,7*60,14*60,22*60,30*60]

	var leafPos = [];
	var budPos = [];

	function init() {

	}

	function update() {
		osc += Math.PI/180;
		osc2 += Math.PI/37;

		t.wobbleV += t.wobble/-50;
		t.wobble += t.wobbleV;
		t.wobbleV *= 0.92;

		if (t.activeAbility != null) {
			var result = t.activeAbility.use(t.abilTime++, t, t.other);
			if (result || t.abilTime > t.activeAbility.useDuration) t.activeAbility = null;
		}

	 	for (var i=0; i<t.abilityCooldowns.length; i++) {
	 		if (t.abilityCooldowns[i]>0) t.abilityCooldowns[i]--;
	 	}

	 	var stunted = false;

	 	for (var i=0; i<t.buffs.length; i++) {
	 		var b = t.buffs[i];
	 		if (b.isStunted != null && b.isStunted()) stunted = true;

	 		if (b.onTick != null) {
	 			if (b.onTick(t, t.other)) {
	 				if (b.time != null) {
	 					if (b.time-- <= 0) {
	 						t.buffs.splice(i--, 1);
	 					}
	 				}
	 			}
	 			else {
	 				t.buffs.splice(i--, 1);
	 			}
	 		} else {
	 			if (b.time != null) {
	 				if (b.time-- <= 0) {
	 					t.buffs.splice(i--, 1);
	 				}
	 			}
	 		}
	 	}

	 	if (!stunted) {
	 		t.growth += 2;
	 	}
	}

	//game functions

	function tryGrow() {

	}

	function useAbility(id) {
		if (t.activeAbility != null) return 1;
		if (t.abilityCooldowns[id] != 0) return 3;

		for (var i=0; i<t.buffs.length; i++) {
			if (t.buffs[i].isStunned != null && t.buffs[i].isStunned()) return 2;
		}

		//we're clear, use the ability

		t.activeAbility = t.abilities[id];
		var cd = t.activeAbility.cooldown;

		t.abilTime = 0;

		for (var i=0; i<t.buffs.length; i++) {
			if (t.buffs[i].onAbility != null) cd = t.buffs[i].onAbility(t, t.other, t.activeAbility, cd);
		}

		t.abilityCooldowns[id] = cd;
		t.cdMax[id] = cd;

		return 0;
	}

	function damage(ability, idamage) {
		var dam = idamage;

		for (var i=0; i<t.other.buffs.length; i++) {
			if (t.other.buffs[i].onInflict != null) dam = t.other.buffs[i].onInflict(t.other, t, ability, dam)
		}

		for (var i=0; i<t.buffs.length; i++) {
			if (t.buffs[i].onHit != null) dam = t.buffs[i].onHit(t, t.other, ability, dam)
		}

		if (dam == 0) {
			for (var i=0; i<t.buffs.length; i++) {
				if (t.buffs[i].onDeflect != null) t.buffs[i].onDeflect(t, t.other, ability, idamage);
			}
		} else {
			t.growth -= Math.round(dam);
		}

		if (dam > 0) {
			if (dam>100) playSound("big hit.wav");
			else playSound("small hit.wav");
		}
		return Math.round(dam);
	}

	function inflictBuff(buff) {
		t.buffs.push(buff);
	}


	function drawStalk(startPos, ctx, gen) {
		if (gen) {
			leafPos = [];
			budPos = [];
		}
		var pos = [startPos[0], startPos[1]];
		var flip = (cont == 1)?-1:1;

		var height = (272*2)*(t.growth/10000);
		var rotSeg = ((t.attackCurve+t.wobble)*Math.PI/180)/(height/6)*flip;

		var vLastPos = pos;

		var rotMat = mat2.create();

		ctx.beginPath();
		ctx.moveTo(pos[0], pos[1]);
		var rotation = 0;
		var leaf = true;
		var lflip = false;
		for (var y=0; y<height; y+=6) {

			if (gen && y % 36 == 0 && y != 0) {
				var item = [pos[0], pos[1], rotation, lflip];
				if (leaf) {
					leafPos.push(item);
				} else {
					budPos.push(item);
					lflip = !lflip;
				}
				leaf = !leaf;
			}

			var mult = flip*((y>120)?1:y/120);

			var vpos = [startPos[0]+mult*
				(Math.cos((y/240)*Math.PI)*20 + (y/50)*Math.sin(osc+y/400)), startPos[1]-y];

			mat2.rotate(rotMat, rotMat, rotSeg);
			var vector = vec2.transformMat2([], vec2.sub([], vpos, vLastPos), rotMat);

			rotation = Math.atan2(vector[0], -vector[1]);
			vec2.add(pos, pos, vector);
			vLastPos = vpos;

			ctx.lineTo(pos[0], pos[1]);
		}
		return [pos, rotation];
	}

	function render(ctx) {
		var finalPos = drawStalk(t.p, ctx, true)

		ctx.strokeStyle = "#1A6600";
		ctx.lineWidth = 16;
		ctx.stroke();
		ctx.strokeStyle = "#008C00";
		ctx.lineWidth = 12;
		ctx.stroke();

		drawStalk([t.p[0]+4, t.p[1]-4], ctx)
		ctx.strokeStyle = "#36AC01";
		ctx.lineWidth = 6;
		ctx.stroke();


		for (var i=0; i<leafPos.length; i++) {
			ctx.save()
			ctx.translate(leafPos[i][0], leafPos[i][1]);
			ctx.rotate(leafPos[i][2]);

			var img = res.img["leaf"+((leafPos[i][3])?"flip":"")+".png"];
			ctx.drawImage(img, img.width/-2, img.height/-2);
			ctx.restore();
		}


		for (var i=0; i<budPos.length; i++) {
			ctx.save()
			ctx.translate(budPos[i][0], budPos[i][1]);
			ctx.rotate(budPos[i][2]);

			var img = res.img["bud"+((budPos[i][3])?"flip":"")+".png"];
			ctx.drawImage(img, img.width/-2, img.height/-2);
			ctx.restore();
		}

		//draw flower head at final pos

		ctx.save();
		var pos = finalPos[0];
		var rot = finalPos[1];
		ctx.translate(pos[0], pos[1]);
		ctx.rotate(rot);

		var img = res.img["flowers/"+t.abilities[5].flower+"_"+t.expression+".png"];
		ctx.drawImage(img, img.width/-2, img.height/-2)
		ctx.restore();

		if (t.activeAbility != null) {
			ctx.textAlign = "center";
			ctx.font = "bold 34px Trebuchet MS";
			ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
			ctx.fillStyle = "white";

			ctx.lineWidth = 8;
			ctx.strokeText(t.activeAbility.name, t.p[0], 406*2);
			ctx.fillText(t.activeAbility.name, t.p[0], 406*2);

			ctx.textAlign = "left";
		}

		//draw buffs and debuffs
		for (var i=0; i<t.buffs.length; i++) {
			var yoff = t.p[1]+(91+15*i)*2;
			var buff = t.buffs[i];
			var name = buff.getName();

			ctx.font = "bold 28px Trebuchet MS";
			var width = ctx.measureText(name).width;

			var fullwidth = width + 32;

			var buffCol = buff.debuff?"#FF4000":"#80FF00";

			ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
			ctx.fillStyle = buffCol;
			ctx.lineWidth = 8;
			ctx.strokeText(name, (t.p[0]-fullwidth/2)+32, yoff);
			ctx.fillText(name, (t.p[0]-fullwidth/2)+32, yoff);

			ctx.beginPath();
			ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
			ctx.arc(t.p[0]+12-fullwidth/2, yoff-10, 16, 0, Math.PI*2, true);
			ctx.fill();

			ctx.beginPath();
			ctx.strokeStyle = buffCol;
			ctx.arc(t.p[0]+12-fullwidth/2, yoff-10, 11, 0, Math.PI*2, true);
			ctx.lineWidth = 2;
			ctx.stroke();

			var buffCD = 1-((buff.time != null)?buff.time/buff.duration:1);

			ctx.beginPath();
			ctx.arc(t.p[0]+12-fullwidth/2, yoff-10, 11, -0.5*Math.PI, (-0.5+(buffCD*2)) * Math.PI, true);
			ctx.lineTo(t.p[0]+12-fullwidth/2, yoff-10);
			ctx.fillStyle = buffCol;
			ctx.fill();
		}
	}

	function playSound(snd) {
		var source = scene.game.ac.createBufferSource();
		source.buffer = res.snd["snd/"+snd];
		source.connect(scene.game.outGain);
		source.start(0);
	}
}

