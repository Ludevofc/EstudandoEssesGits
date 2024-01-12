function gameUI(scn) {
	var t = this;
	var modeTime = 0;
	var lastMode = -1;

	var bounceTextPos = [];
	var bounceTextVel = [];
	var bounceDelayMod = 0;
	var scoreBoard = 0;
	var sbVel = 0;

	t.update = update;
	t.render = render;

	function update() {
		if (scn.mode != lastMode) {
			lastMode = scn.mode;
			modeTime = 0;
			switch (scn.mode) {
				case 0:
					initBounceText("3..2..1..");
					bounceDelayMod = 20;
					break;
				case 1:
					initBounceText("GO!");
					bounceDelayMod = 5;
					break;
				case 2:
					initBounceText("TIME!");
					bounceDelayMod = 5;
					break;
			}
		}

		for (var i=0; i<bounceTextPos.length; i++) {
			if (modeTime > i*bounceDelayMod || scn.mode == 3) {
				bounceTextPos[i] += bounceTextVel[i];
				bounceTextVel[i] += (1-bounceTextPos[i])/15;
				bounceTextVel[i] *= 0.7;
			}
		}

		var scoreboardTarget = 0;
		if (scn.mode == 1) {
			scoreboardTarget = (scn.game.keyDownArray[9])?1:0;
		} else if (scn.mode == 3 && scn.time>1.5) {
			scoreboardTarget = 1;
		}
		sbVel += (scoreboardTarget-scoreBoard)/50;
		scoreBoard += sbVel;
		sbVel *= 0.9;

		modeTime++;
	}

	function render(ctx) {

		if (scn.mode == 1) {
			var dT = 120-scn.time;

			ctx.font = "bold 40px Trebuchet MS, Arial Bold, sans-serif";
			ctx.fillStyle = "#FFFFFF"
			ctx.lineWidth = 5;
			ctx.strokeStyle = "#0066BB";
			ctx.textBaseline = "top"
			ctx.textAlign = "center"
			var time = Math.floor(dT/60)+":"+zeroPad(dT%60, 2);
			ctx.strokeText(time, ctx.canvas.width/2, 10);
			ctx.fillText(time, ctx.canvas.width/2, 10);

			var ply;
			for (var i=0; i<scn.players.length; i++) {
				if (!scn.players[i].net) ply = scn.players[i];
			}

			if (ply != null) {
				ctx.font = "bold 40px Trebuchet MS, Arial Bold, sans-serif";
				ctx.textBaseline = "bottom"
				ctx.textAlign = "right"
				var str = ropeObjDefs[ply.ropeWep].name;
				ctx.strokeText(str, ctx.canvas.width-15, ctx.canvas.height-10);
				ctx.fillText(str, ctx.canvas.width-15, ctx.canvas.height-10);


				ctx.font = "bold 15px Trebuchet MS, Arial Bold, sans-serif";
				ctx.lineWidth = 3;
				ctx.strokeStyle = "#00AADD";
				var str = "Weapon:";
				ctx.strokeText(str, ctx.canvas.width-15, ctx.canvas.height-55);
				ctx.fillText(str, ctx.canvas.width-15, ctx.canvas.height-55);

				//scores

				var activeUsers = [];
				for (var i=0; i<scn.players.length; i++) {
					if (scn.players[i].active) activeUsers.push(scn.players[i]);
				}

				activeUsers.sort(function(a, b){
					return (a.score < b.score);
				})


				ctx.font = "bold 40px Trebuchet MS, Arial Bold, sans-serif";
				ctx.textBaseline = "bottom"
				ctx.textAlign = "left"
				ctx.lineWidth = 5;
				ctx.strokeStyle = "#0066BB";
				var place = activeUsers.indexOf(ply)+1;
				var str = ply.score + " ("+place+numberSuffix(place)+")";
				ctx.strokeText(str, 15, ctx.canvas.height-10);
				ctx.fillText(str, 15, ctx.canvas.height-10);


				ctx.font = "bold 15px Trebuchet MS, Arial Bold, sans-serif";
				ctx.lineWidth = 3;
				ctx.strokeStyle = "#00AADD";
				var str = "Score:";
				ctx.strokeText(str, 15, ctx.canvas.height-55);
				ctx.fillText(str, 15, ctx.canvas.height-55);
			}

		}

		if (scn.mode > 1 && scn.time < 2) {
			//TIME!
			if (scn.mode == 3 && modeTime > 90) {
				ctx.globalAlpha = Math.max(0, (120-modeTime))/30;
			} 
			ctx.font = "150px Trebuchet MS";
			ctx.fillStyle = "white";
			ctx.lineWidth = 10;
			drawBounceText(ctx, "TIME!", "#003366", "#0066BB");
			ctx.globalAlpha = 1;
		} else if (scn.mode == 0) {
			ctx.font = "150px Trebuchet MS";
			ctx.fillStyle = "white";
			ctx.lineWidth = 10;
			drawBounceText(ctx, "3..2..1..", "#003366", "#0066BB");
		} else if (scn.mode == 1 && modeTime < 90) {
			if (modeTime > 60) {
				ctx.globalAlpha = Math.max(0, (90-modeTime))/30;
			} 
			ctx.font = "150px Trebuchet MS";
			ctx.fillStyle = "white";
			ctx.lineWidth = 10;
			drawBounceText(ctx, "GO!", "#003366", "#0066BB");
			ctx.globalAlpha = 1;
		}

		drawScoreBoard(ctx, (scn.mode == 3));
	}

	function numberSuffix(num) {
		if (Math.floor(num/10)%10 == 1) return "th";
		if (num%10 == 1) return "st";
		if (num%10 == 2) return "nd";
		if (num%10 == 3) return "rd";
		return "th";
	}

	function drawScoreBoard(ctx, center) {
		ctx.save();
		ctx.textBaseline = "top";
		var activeUsers = [];
		for (var i=0; i<scn.players.length; i++) {
			if (scn.players[i].active) activeUsers.push(scn.players[i]);
		}

		activeUsers.sort(function(a, b){
			return (a.score < b.score);
		})

		var height = 65+activeUsers.length*20+5;

		if (center) ctx.translate(ctx.canvas.width/2-175, (ctx.canvas.height-height*scoreBoard)/2)

		ctx.globalAlpha = 0.75;
		ctx.beginPath();
		ctx.rect(0,0,350,height*scoreBoard);
		ctx.fillStyle = "#003366";
		ctx.fill();
		ctx.clip();
		ctx.globalAlpha = 1;

		ctx.font = "30px Impact, Arial Bold, sans-serif";
		ctx.fillStyle = "#6699FF"
		ctx.textBaseline = "top";
		ctx.textAlign = "center";
		ctx.fillText(activeUsers[0].name + ((scn.mode == 3)?" Wins!":" is in the lead!"), 350/2, 6);

		ctx.fillStyle = "#6699FF"
		ctx.fillRect(0, 40, 350, 4);

		//headers
		ctx.font = "12px Impact, Arial Bold, sans-serif";
		ctx.fillStyle = "#AACCFF"
		ctx.textAlign = "left"
		ctx.fillText("Name", 3, 48);
		ctx.fillText("Score", 157, 48);
		ctx.fillText("Kills", 207, 48);
		ctx.fillText("Assists", 257, 48);
		ctx.fillText("Deaths", 307, 48);

		ctx.fillRect(155, 49, 1, height-52);
		ctx.fillRect(205, 49, 1, height-52);
		ctx.fillRect(255, 49, 1, height-52);
		ctx.fillRect(305, 49, 1, height-52);

		//data
		for (var i=0; i<activeUsers.length; i++) {
			var e = activeUsers[i];
			ctx.font = "15px Impact, Arial Bold, sans-serif";
			ctx.fillStyle = "#FFFFFF";
			ctx.fillText(e.name, 3, 63+i*20);
			ctx.fillText(e.score, 157, 63+i*20);
			ctx.fillText(e.kills, 207, 63+i*20);
			ctx.fillText(e.assists, 257, 63+i*20);
			ctx.fillStyle = "#6699FF";
			ctx.fillText(e.deaths, 307, 63+i*20);
		}
		ctx.restore();

		return activeUsers;
	}

	function initBounceText(text) {
		bounceTextPos = [];
		bounceTextVel = [];
		for (var i=0; i<text.length; i++) {
			bounceTextPos.push(10);
			bounceTextVel.push(-0.5);
		}
	}

	function zeroPad(num, length) {
		var n = String(num);
		while (n.length < length) {
			n = "0"+n;
		}
		return n;
	}

	function drawBounceText(ctx, text, darkStroke, lightStroke) {
		var total = ctx.measureText(text).width;
		ctx.save();
		ctx.translate(ctx.canvas.width/2, ctx.canvas.height/2);

		for (var i=0; i<text.length; i++) {
			if (modeTime <= bounceDelayMod*i && scn.mode != 3) break;
			ctx.save();
			ctx.scale(bounceTextPos[i], bounceTextPos[i]);
			ctx.textBaseline = "middle";

			var before = ctx.measureText(text.substr(0, i)).width;
			ctx.strokeStyle = darkStroke;
			ctx.strokeText(text[i], before-total/2, 6);
			ctx.strokeText(text[i], before-total/2, 3);
			ctx.strokeStyle = lightStroke;
			ctx.strokeText(text[i], before-total/2, 0);
			ctx.fillText(text[i], before-total/2, 0);

			ctx.restore();
		}

		ctx.restore();
	}
}