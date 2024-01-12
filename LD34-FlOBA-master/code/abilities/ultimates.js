//ultimates

abDestructUlt = new function() {
	var t = this;
	t.type = "phys";
	t.cooldown = 45*60;

	var types = ["phys", "fire", "psn"]

	t.name = "MASS DESTRUCTION";
	t.ico = "destructUlt";

	t.description = ["Unleashes 5 seconds of devastation", "on the foe, with hits using", "all damage types."]

	t.useDuration = 5*60;
	t.time = t.duration;

	t.use = function(time, user, target) {
		if (time == 0) user.wobbleV += 10;
		else if (time > 30) {
			var mult = Math.min(time-30, time);

			user.wobble = Math.sin(time/3)*time;
			user.wobbleV = Math.sin(time/3)*time - Math.sin((time-1)/3)*(time-1);

			if (time%20 == 0) {
				t.type = types[Math.floor(time/20)%3];
				target.damage(t, 100)
			}
		}
	}

	t.flower = "des";
}

abInvulnUlt = new function() {
	var t = this;
	t.type = "phys";
	t.name = "INVULNERABILITY"
	t.cooldown = 45*60;

	t.description = ["Makes the user invulnerable,", "leaving them with 6 seconds", "to use to nuke the", "other wilted pos."]

	t.useDuration = 1;
	t.time = t.duration;

	t.ico = "invulnUlt"

	t.use = function(time, user, target) {
		if (time == 0) {
			user.wobbleV += 10;
			user.inflictBuff(new bfInvuln(60*5));
		}
	}

	t.flower = "inv";
}



abLevelUlt = new function() {
	var t = this;
	t.type = "phys";
	t.cooldown = 45*60;

	t.ico = "levelUlt"
	t.name = "LEVEL GROWTH"
	t.description = ["Levels the playing field.", "Both growths are dragged towards", "each other, with a final", "distance of about a third."]

	t.useDuration = 60*2;

	t.use = function(time, user, target) {
		if (time == 0) user.inflictBuff(new bfLevel(2*60));

		user.wobble = Math.sin(time/4)*15;
		user.wobbleV = Math.sin(time/4)*15 - Math.sin((time-1)/4)*15;

		target.wobble = user.wobble;
		target.wobbleV = user.wobbleV;
	}

	t.flower = "lvl";
}


abSpeedyUlt = new function() {
	var t = this;
	t.type = "phys";
	t.name = "SPEEDY GROWTH";
	t.description = ["Accelerates growth by an insane", "amount for a good 5 seconds.", "Goes through stunt."]
	t.cooldown = 45*60;

	t.ico = "growUlt"

	t.useDuration = 60;

	t.use = function(time, user, target) {
		if (time < 40) {
			user.wobble = Math.sin(time/3)*time;
			user.wobbleV = Math.sin(time/3)*time - Math.sin((time-1)/3)*(time-1);
		} else if (time == 40) {
			user.inflictBuff(new bfSpeedyGrowth(5*60));
		}
	}
	t.flower = "speed";
}