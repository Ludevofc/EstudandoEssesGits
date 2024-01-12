//offensive abilities

abBodySlam = new function() {
	var t = this;
	t.type = "phys";
	t.cooldown = 15*60;

	t.ico = "body_slam"
	t.name = "Body Slam"
	t.description = ["Slams into the enemy inflicting", "massive damage, but self-inflicts", "a 2 second stun."];

	t.useDuration = 30;

	t.use = function(time, user, target) {
		user.attackCurve = Math.sin(time/30*Math.PI)*120;
		if (time == 15) {
			target.damage(t, 500);
			user.inflictBuff(new bfStun(120));
			target.wobbleV -= 5;
		}
	}
}

abRazorLeaf = new function() {
	var t = this;
	t.type = "phys";
	t.cooldown = 8*60;

	t.ico = "body_slam"
	t.name = "Razor Leaf"
	t.description = ["Fires 3 leaves at the enemy,", "one of which disabling a random", "ability for 4 seconds"];

	t.useDuration = 60;

	t.use = function(time, user, target) {
		if (time == 0) {
			user.wobbleV += 1;
		} else if (time == 15) {
			user.wobbleV += 1;
		} else if (time == 30) {
			target.damage(t, 100);
			var disableChoice = user.scene.game.rng.nextInt()%6;
			if (target.abilityCooldowns[disableChoice] < 4*60) {
				target.abilityCooldowns[disableChoice] = 4*60;
				target.cdMax[disableChoice] = 4*60;
			}
			target.wobbleV -= 3;
			user.wobbleV += 1;
		} else if (time == 45) {
			target.damage(t, 100);
			target.wobbleV -= 3;
		} else if (time == 60) {
			target.damage(t, 100);
			target.wobbleV -= 3;
		}
	}
}

abRocketBud = new function() {
	var t = this;
	t.type = "phys";
	t.cooldown = 15*60;

	t.ico = "body_slam"
	t.name = "Rocket Bud"
	t.description = ["Interruptably charges for 1+1/2s", "then fires a bud at the", "enemy, stunning for 4 seconds."]

	t.useDuration = 110;

	t.use = function(time, user, target) {
		if (time == 0) {
			//start animation
		} else if (time < 90) {
			//channelling, interruptable.
			user.wobbleV = 0.3;
			for (var i=0; i<user.buffs.length; i++) {
				if (user.buffs[i].isStunned != null && user.buffs[i].isStunned()) return true;
			}
		} else if (time == 90) {
			user.wobbleV -= 6;
		} else if (time == 110) {
			target.damage(t, 300);
			target.inflictBuff(new bfStun(4*60));
			target.wobbleV -= 6;
		}
	}
}

abFlaming = new function() {
	var t = this;
	t.type = "fire";
	t.cooldown = 5*60;

	t.ico = "fire"
	t.name = "Flaming Oil"
	t.description = ["Small damage to start, but", "subsequent hits stack 0.5x", "more damage each time."]

	t.useDuration = 60;

	t.use = function(time, user, target) {
		if (time == 0) {
			user.wobbleV += 1;
		} else if (time == 15) {
			user.wobbleV += 1;
		} else if (time == 30) {
			target.damage(t, 50);
			target.wobbleV -= 3;
			user.wobbleV += 1;
		} else if (time == 45) {
			target.damage(t, 50);
			target.wobbleV -= 3;
		} else if (time == 60) {
			var resultDmg = target.damage(t, 50);
			target.wobbleV -= 3;

			//try find flaming oil deduff and add a stack
			var flam = null;
			for (var i=0; i<target.buffs.length; i++) {
				if (target.buffs[i].flamOil) flam = target.buffs[i];
			}
			if (flam != null) {
				flam.stacks++;
				if (flam.stacks > 6) flam.stacks = 6;
				flam.time = flam.duration;
			} else if (resultDmg != 0) {
				target.inflictBuff(new bfFlaming());
			}
		}
	}
}

abGetMad = new function() {
	var t = this;
	t.type = "fire";
	t.cooldown = 12*60;

	t.ico = "fire"
	t.name = "Get Mad"
	t.description = ["Makes the next physical attack", "used do additional fire damage", "of the same magnitude."]

	t.useDuration = 60;

	t.use = function(time, user, target) {
		if (time < 40) {
			user.wobble = Math.sin(time/3)*time;
			user.wobbleV = Math.sin(time/3)*time - Math.sin((time-1)/3)*(time-1);
		} else if (time == 40) {
			user.inflictBuff(new bfGetMad());
		}
	}
}

abFlamingSpores = new function() {
	var t = this;
	t.type = "fire";
	t.cooldown = 14*60;

	t.ico = "fire"
	t.name = "Flaming Spores"
	t.description = ["3 second damage over time.", "Does a lot of damage overall."]

	t.useDuration = 60;

	t.use = function(time, user, target) {
		if (time < 40) {
			user.wobble = Math.sin(time/4)*15;
			user.wobbleV = Math.sin(time/4)*15 - Math.sin((time-1)/4)*15;
		} else if (time == 40) {
			target.inflictBuff(new bfFlamingSpores());
		}
	}
}

abPoisonSpikes = new function() {
	var t = this;
	t.type = "psn";
	t.cooldown = 14*60;

	t.ico = "poison_thorn"
	t.name = "Poison Spikes"
	t.description = ["For 5 seconds, damages the enemy", "for each ability they use."]

	t.useDuration = 20;

	t.use = function(time, user, target) {
		if (time == 0) {
			user.wobbleV += 3;
			target.inflictBuff(new bfPoisonSpikes());
		}
	}
}

abAcidRain = new function() {
	var t = this;
	t.type = "psn";
	t.cooldown = 15*60;

	t.ico = "poison_thorn"
	t.name = "Acid Rain"
	t.description = ["Damage over time that does", "damage proportional to the", "enemy's height."]

	t.useDuration = 60;

	t.use = function(time, user, target) {
		if (time < 40) {
			user.wobble = Math.sin(time/4)*15;
			user.wobbleV = Math.sin(time/4)*15 - Math.sin((time-1)/4)*15;
		} else if (time == 40) {
			target.inflictBuff(new bfAcidRain());
		}
	}
}

abSlowToxin = new function() {
	var t = this;
	t.type = "psn";
	t.cooldown = 15*60;

	t.ico = "poison_thorn"
	t.name = "Slow Toxin"
	t.description = ["Abilities the enemy uses in", "the next 3s have 1.5x their", "normal cooldowns."]

	t.useDuration = 110;

	t.use = function(time, user, target) {
		if (time == 0) {
			//start animation
		} else if (time < 50) {
			user.wobbleV = 0.5;
		} else if (time == 50) {
			//shoot toxin
			user.wobbleV -= 6;
		} else if (time == 70) {
			target.damage(t, 300);
			target.inflictBuff(new bfSlowToxin());
			target.wobbleV -= 6;
		}
	}
}


abNeurotoxin = new function() {
	var t = this;
	t.type = "psn";
	t.cooldown = 1*60;

	t.ico = "poison_thorn"
	t.name = "Neurotoxin"
	t.description = ["Stunts the enemy's passive", "growth for 5s."]

	t.useDuration = 60;

	t.use = function(time, user, target) {
		if (time < 40) {
			user.wobble = Math.sin(time/4)*15;
			user.wobbleV = Math.sin(time/4)*15 - Math.sin((time-1)/4)*15;
		} else if (time == 40) {
			target.inflictBuff(new bfNeurotoxin());
		}
	}
}

