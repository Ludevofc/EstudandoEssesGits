//pick scene 1

//ingame scene

function pick1Scene(game) {
	var t = this;
	var game = game;
	var res = game.res;

	var PICK_TIMES = 10*60

	t.init = init;
	t.update = update;
	t.render = render;
	t.game = game;
	t.res = res;

	t.abilityText = "unknown";

	t.pickTurn = 0;
	t.pickTime = PICK_TIMES;

	var allAbilities = [
		//start at 134, 470
		//94 sized gaps
		abBodySlam,		abRazorLeaf,		abRocketBud,		abPoisonSpikes,		abAcidRain,
		abFlaming,		abGetMad,			abFlamingSpores, 	abSlowToxin,		abNeurotoxin,

		//start again at 134, 738
		//94 sized gaps
		abReflect,		abSpikedThorns,		abFireImmune,		abPoisonImmune, 	abPhysImmune,
		abWeedKiller,	abPhotosynthesis,	abPoisonAbsorb,		abBurstGrowth,		abFlashFreeze,
	]

	var heights = [470, 470+94, 738, 738+94];
	
	var p1sel, p2sel;
	var abilityIcos = [];
	var entities = [];

	var abilLoc = [];
	var abilScale = [];

	var p1abil = [];
	var p2abil = [];

	var failEnt;

	var myPlant, mySel;

	var firstTick = true;

	function init() {

		//build ability list
		for (var y=0; y<4; y++) {
			var x=134;
			for (var i=y*5; i<(y+1)*5; i++) {
				abilLoc[i] = [x, heights[y]];
				abilScale[i] = 0.59375;
				var ico = new abilityIcon(t, allAbilities[i], abilLoc[i]);
				abilityIcos.push(ico);
				entities.push(ico);
				x += 94;
			}
		}

		imone = (game.netFacade.clientID == 0);
		p1sel = new genericSelector(t, abilLoc, abilScale, 0);
		p2sel = new genericSelector(t, abilLoc, abilScale, 1);

		p1sel.onSelect = function() {
			if (t.pickTurn%2 == 0) {
				advanceTurn();
			}
		}
		p2sel.onSelect = function() {
			if (t.pickTurn%2 == 1) {
				advanceTurn();
			}
		}

		mySel = (imone)?p1sel:p2sel;

		entities.push(p1sel);
		entities.push(p2sel);

		mySel.onChange = function() {
			playSound("change.wav");
		}
	}

	function advanceTurn() {
		//take choice and place it in player's draft
		playSound("select.wav");
		if (t.pickTurn%2 == 0) {
			var ability = allAbilities[p1sel.index];
			p1abil.push(ability);
			allAbilities.splice(p1sel.index, 1);
			abilLoc.splice(p1sel.index, 1);
			abilScale.splice(p1sel.index, 1);

			abilityIcos[p1sel.index].pulse = 0.5;
			abilityIcos[p1sel.index].sel = 0;
			abilityIcos.splice(p1sel.index, 1);
		} else {
			var ability = allAbilities[p2sel.index];
			p2abil.push(ability);
			allAbilities.splice(p2sel.index, 1);
			abilLoc.splice(p2sel.index, 1);
			abilScale.splice(p2sel.index, 1);

			abilityIcos[p2sel.index].pulse = 0.5;
			abilityIcos[p2sel.index].sel = 1;
			abilityIcos.splice(p2sel.index, 1);
		}

		p1sel.index = Math.min(allAbilities.length-1, p1sel.index);
		p2sel.index = Math.min(allAbilities.length-1, p2sel.index);

		t.pickTime = PICK_TIMES;
		t.pickTurn++;

		if (t.pickTurn >= 10) {
			//we're done, advance to ult selection
			game.activeScene = new pick2Scene(game, p1abil, p2abil);
			game.activeScene.init();
		}
	}

	function update() {
		if (--t.pickTime == 0) {
			advanceTurn();
		}

		p1sel.disabled = (t.pickTurn >= 10 || t.pickTurn%2 == 1);
		p2sel.disabled = (t.pickTurn >= 10 || t.pickTurn%2 == 0);

		for (var i=0; i<entities.length; i++) 
			entities[i].update();
		firstTick = false;
	}

	function render(ctx) {
		ctx.save();
		ctx.scale(0.5,0.5);
		ctx.drawImage(res.img["pickunder.png"], 0, 0);

		ctx.drawImage(res.img["pick1over.png"], 0, 0);

		for (var i=0; i<entities.length; i++) 
			entities[i].render(ctx);

		var activeSel = (t.pickTurn%2 == 1)?p2sel:p1sel;

		ctx.textAlign = "center";

		if (firstTick) {
			ctx.font = "bold 45px Trebuchet MS";
			ctx.fillStyle = "white";
			ctx.fillText("WAITING FOR OTHER PLAYER", 320, 307);
		} else {
			var turn = (t.pickTurn%2 == game.netFacade.clientID)?"YOUR TURN":"ENEMY'S TURN";
			ctx.font = "bold 36px Trebuchet MS";
			ctx.fillStyle = "white";
			ctx.fillText(turn, 320, 267);

			ctx.font = "bold 56px Trebuchet MS";
			ctx.fillText(Math.ceil(t.pickTime/60)+" SECONDS REMAINING", 320, 323);

		}

		var ability = allAbilities[activeSel.index];
		ctx.font = "bold 54px Trebuchet MS";
		ctx.fillStyle = "#8C2200";
		ctx.fillText(ability.name+" ("+ability.type+")", 320, 960);

		if (ability.description != null) {
			for (var i=0; i<ability.description.length; i++) {
				ctx.font = "bold 38px Trebuchet MS";
				ctx.fillText(ability.description[i], 320, 1007+40*i);
			}
		}

		ctx.textAlign = "left";

		ctx.restore();
	}

	function playSound(snd) {
		var source = game.ac.createBufferSource();
		source.buffer = res.snd["snd/"+snd];
		source.connect(game.outGain);
		source.start(0);
	}
}