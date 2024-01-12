//flower pick scene

//pick scene 1

//ingame scene

function pick2Scene(game, p1a, p2a) {
	var t = this;
	var game = game;
	var res = game.res;

	t.init = init;
	t.update = update;
	t.render = render;
	t.game = game;
	t.res = res;

	t.abilityText = "unknown";

	t.pickTurn = 0;
	t.pickTime = 20*60;

	var allAbilities = [
		abDestructUlt, abInvulnUlt, abLevelUlt, abSpeedyUlt
	]

	var p1sel, p2sel;
	var abilityIcos = [];
	var entities = [];

	var abilLoc = [
		[110, 748], [250, 748], [390, 748], [530, 748], 
	];
	var abilScale = [1,1,1,1];

	var p1abil = p1a;
	var p2abil = p2a;

	var failEnt;

	var myPlant, mySel;
	var gameFade = -1;

	function init() {

		//build ability list
		for (var i=0; i<allAbilities.length; i++) {
			var ico = new abilityIcon(t, allAbilities[i], abilLoc[i]);
			abilityIcos.push(ico);
			entities.push(ico);
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

			abilityIcos[p1sel.index].pulse = 0.5
		} else {
			var ability = allAbilities[p2sel.index];
			p2abil.push(ability);

			abilityIcos[p2sel.index].pulse = 0.5
		}

		p1sel.index = Math.min(allAbilities.length-1, p1sel.index);
		p2sel.index = Math.min(allAbilities.length-1, p2sel.index);

		t.pickTime = 20*60;
		t.pickTurn++;

		if (t.pickTurn >= 2) {
			//we're done, advance to game
			gameFade = 0;
		}
	}

	function update() {
		if (--t.pickTime == 0) {
			advanceTurn();
		}

		p1sel.disabled = (t.pickTurn >= 2 || t.pickTurn%2 == 1);
		p2sel.disabled = (t.pickTurn >= 2 || t.pickTurn%2 == 0);

		for (var i=0; i<entities.length; i++) 
			entities[i].update();

		if (gameFade > -1) {
			if (gameFade++ >= 30) {
				game.activeScene = new ingameScene(game, p1abil, p2abil);
				game.activeScene.init();
			}
		}
	}

	function render(ctx) {
		ctx.save();
		ctx.scale(0.5,0.5);
		ctx.drawImage(res.img["pickunder.png"], 0, 0);

		ctx.drawImage(res.img["pick2over.png"], 0, 0);

		for (var i=0; i<entities.length; i++) 
			entities[i].render(ctx);

		var activeSel = (t.pickTurn%2 == 1)?p2sel:p1sel;

		ctx.textAlign = "center";

		var turn = (t.pickTurn%2 == game.netFacade.clientID)?"YOUR TURN":"ENEMY'S TURN";
		ctx.font = "bold 36px Trebuchet MS";
		ctx.fillStyle = "white";
		ctx.fillText(turn, 320, 267);

		ctx.font = "bold 56px Trebuchet MS";
		ctx.fillText(Math.ceil(t.pickTime/60)+" SECONDS REMAINING", 320, 323);

		var ability = allAbilities[activeSel.index];
		ctx.font = "bold 54px Trebuchet MS";
		ctx.fillStyle = "#8C2200";
		ctx.fillText(ability.name, 320, 960-66);

		if (ability.description != null) {
			for (var i=0; i<ability.description.length; i++) {
				ctx.font = "bold 38px Trebuchet MS";
				ctx.fillText(ability.description[i], 320, (1007-66)+40*i);
			}
		}

		ctx.textAlign = "left";

		var img1 = res.img["flowers/"+allAbilities[p1sel.index].flower+"_normal.png"]
		ctx.drawImage(img1, 160-img1.width/2, 500-img1.height/2);

		var img2 = res.img["flowers/"+allAbilities[p2sel.index].flower+"_normal.png"]
		ctx.drawImage(img2, 320+160-img2.width/2, 500-img2.height/2);

		if (gameFade > 0) {
			ctx.globalAlpha = gameFade/30;
			ctx.fillStyle = "white";
			ctx.fillRect(0, 0, ctx.canvas.width*2, ctx.canvas.height*2);
			ctx.globalAlpha = 1;
		}

		ctx.restore();
	}

	function playSound(snd) {
		var source = game.ac.createBufferSource();
		source.buffer = res.snd["snd/"+snd];
		source.connect(game.outGain);
		source.start(0);
	}
}