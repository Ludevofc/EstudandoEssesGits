//ingame scene

function ingameScene(game, p1ability, p2ability) {
	var t = this;
	var game = game;
	var res = game.res;

	t.init = init;
	t.update = update;
	t.render = render;
	t.game = game;
	t.res = res;

	t.p1plant = new plant(t, [79*2, 337*2], 0, p1ability);
	t.p2plant = new plant(t, [251*2, 337*2], 1, p2ability);
	t.p1plant.other = t.p2plant;
	t.p2plant.other = t.p1plant;
	t.abilityText = "unknown";

	abilityPos = [
		[29*2,				508*2],
		[(29+47)*2,			508*2],
		[(29+47*2)*2,		508*2],
		[(29+47*3)*2,		508*2],
		[(29+47*4)*2,		508*2],
		[277*2,				508*2],
	]

	abilityScale = [
		0.59375,
		0.59375,
		0.59375,
		0.59375,
		0.59375,
		1
	]

	otheraPos = [
		[-300, -300],
		[-300, -300],
		[-300, -300],
		[-300, -300],
		[-300, -300],
		[-300, -300]
	]
	otheraScale = [
		0,
		0,
		0,
		0,
		0,
		0
	]

	t.fadeProgress = 0;
	t.active = 0;

	var killMsg = ["I KNEW YOU HAD IT IN YOU!", "You just got flower powered."]
	var growMsg = ["You won the million dollars!!", "You should probably disband."]

	t.gameOver = -1;
	t.gameOverTitle = "";
	t.gameOverMsg = "";

	var p1sel, p2sel;
	var abilityIcos = [];
	var entities = [];

	var failEnt;

	var myPlant, mySel;
	var oPlant

	function init() {

		var source = game.ac.createBufferSource();
		source.buffer = res.snd["snd/music.ogg"];
		source.loop = true;
		source.connect(game.outGain);
		source.start(0);

		imone = (game.netFacade.clientID == 0);
		p1sel = new genericSelector(t, imone?abilityPos:otheraPos, imone?abilityScale:otheraScale, 0);
		p2sel = new genericSelector(t, (!imone)?abilityPos:otheraPos, (!imone)?abilityScale:otheraScale, 1);

		p1sel.disabled = true;
		p2sel.disabled = true;

		p1sel.onSelect = function() {
			var result = t.p1plant.useAbility(p1sel.index);
			
			if (t.p1plant == myPlant) {
				playSound("select.wav");
				abilityIcos[p1sel.index].pulse = 0.5;
				if (result != 0) failEnt.displayFail(result);
			}
		}
		p2sel.onSelect = function() {
			var result = t.p2plant.useAbility(p2sel.index);

			if (t.p2plant == myPlant) {
				playSound("select.wav");
				abilityIcos[p2sel.index].pulse = 0.5;
				if (result != 0) failEnt.displayFail(result);
			}
		}

		myPlant = (imone)?t.p1plant:t.p2plant;
		mySel = (imone)?p1sel:p2sel;
		oPlant = (imone)?t.p2plant:t.p1plant;

		entities.push(p1sel);
		entities.push(p2sel);

		for (var i=0; i<5; i++) {
			var ico = new abilityIcon(t, myPlant.abilities[i], abilityPos[i]);
			abilityIcos.push(ico);
			entities.push(ico);
		}

		mySel.onChange = function() {
			t.abilityText = myPlant.abilities[mySel.index].name;
			playSound("change.wav");
		}
		t.abilityText = myPlant.abilities[mySel.index].name;

		var ico = new abilityIcon(t, myPlant.abilities[5], abilityPos[5]);
		abilityIcos.push(ico);
		entities.push(ico);

		entities.push(new sun(t, [273*2, 43*2]))

		entities.push(t.p1plant);
		entities.push(t.p2plant);

		var failEnt = new failcode(t);
		entities.push(failEnt);
	}

	function update() {

		for (var i=0; i<entities.length; i++) 
			entities[i].update();

		for (var i=0; i<abilityIcos.length; i++) {
			abilityIcos[i].cd = myPlant.abilityCooldowns[i];
			abilityIcos[i].cdMax = myPlant.cdMax[i];
		}

		if (t.fadeProgress != -1) {
			t.fadeProgress++
			if (t.fadeProgress > 60*4) {
				t.fadeProgress = -1;
			} else if (t.fadeProgress > 60*3) {
				p1sel.disabled = false;
				p2sel.disabled = false;
			}
		}

		if (t.gameOver != -1) {
			t.gameOver++;
			return;
		}

		if (t.p1plant.growth >= 10000) {
			gameOver((t.p1plant == myPlant)?"YOU WIN!":"YOU LOSE", growMsg[(t.p1plant == myPlant)?0:1]);
		}
		if (t.p2plant.growth >= 10000) {
			gameOver((t.p2plant == myPlant)?"YOU WIN!":"YOU LOSE", growMsg[(t.p2plant == myPlant)?0:1]);
		}

		if (t.p1plant.growth <= 0) {
			entities.splice(entities.indexOf(t.p1plant), 1);
			gameOver((t.p2plant == myPlant)?"YOU WIN!":"YOU LOSE", killMsg[(t.p2plant == myPlant)?0:1]);
		}
		if (t.p2plant.growth <= 0) {
			entities.splice(entities.indexOf(t.p2plant), 1);
			gameOver((t.p1plant == myPlant)?"YOU WIN!":"YOU LOSE", killMsg[(t.p1plant == myPlant)?0:1])
		}
	}

	function gameOver(title, msg) {
		t.gameOver = 0;
		t.gameOverTitle = title;
		t.gameOverMsg = msg;
		p1sel.disabled = true;
		p2sel.disabled = true;
	}

	function render(ctx) {
		ctx.save();
		ctx.scale(0.5,0.5);
		ctx.drawImage(res.img["bg.png"], 0, 0);

		for (var i=0; i<entities.length; i++) 
			entities[i].render(ctx);

		ctx.textAlign = "center";
		ctx.font = "bold 32px Trebuchet MS";
		ctx.fillStyle = "white";
		ctx.fillText(t.abilityText, 320, 558*2);
		

		if (t.fadeProgress > -1) {
			countText = "";
			switch (Math.floor(t.fadeProgress/60)) {
				case 0:
					countText = "3"
					break;
				case 1:
					countText = "2"
					break;
				case 2:
					countText = "1"
					break;
				case 3:
					countText = "GO!"
					break;
			}

			ctx.strokeStyle = "rgba(0,0,0,0.6)";
			ctx.font = "bold 200px Trebuchet MS";
			ctx.fillStyle = "#D96D00";
			ctx.lineWidth = 36;
			ctx.strokeText(countText, 320+10, 568+10);
			ctx.strokeStyle = "white";
			ctx.strokeText(countText, 320, 568);
			ctx.fillText(countText, 320, 568);

			if (t.fadeProgress < 30) {
				ctx.fillStyle = "white";
				ctx.globalAlpha = 1-(t.fadeProgress/30);
				ctx.fillRect(0,0,ctx.canvas.width*2,ctx.canvas.height*2);
				ctx.globalAlpha = 1;
			}
		}

		if (t.gameOver > -1) {
			var fadein = Math.min(1, (t.gameOver/30));

			ctx.fillStyle = "black";
			ctx.globalAlpha = fadein*0.6;
			ctx.fillRect(0,0,ctx.canvas.width*2,ctx.canvas.height*2);
			
			ctx.globalAlpha = fadein;

			ctx.fillStyle = "white";
			ctx.font = "bold 128px Trebuchet MS"
			ctx.fillText(t.gameOverTitle, 320, 269*2);

			ctx.font = "bold 40px Trebuchet MS"
			ctx.fillText(t.gameOverMsg, 320, 312*2);

			ctx.globalAlpha = 1;
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