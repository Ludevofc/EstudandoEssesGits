//defensive abilities

abFireImmune = new function() {
	var t = this;
	t.type = "phys";
	t.cooldown = 20*60;

	t.ico = "fire_shield"
	t.name = "Sprinkler Shield"
	t.description = ["Grants the user immunity to", "all fire damage for 5s."]

	t.useDuration = 20;

	t.use = function(time, user, target) {
		if (time == 0) {
			user.wobbleV += 3;
			user.inflictBuff(new bfFireImmune(5*60));
		}
	}
}

abPoisonImmune = new function() {
	var t = this;
	t.type = "phys";
	t.cooldown = 20*60;

	t.ico = "psn_shield"
	t.name = "Immuno-Shield"
	t.description = ["Grants the user immunity to", "all poison damage for 5s."]

	t.useDuration = 20;

	t.use = function(time, user, target) {
		if (time == 0) {
			user.wobbleV += 3;
			user.inflictBuff(new bfPoisonImmune(5*60));
		}
	}
}

abPhysImmune = new function() {
	var t = this;
	t.type = "phys";
	t.cooldown = 20*60;

	t.ico = "phys_shield"
	t.name = "Tough Skin"
	t.description = ["Grants the user immunity to", "all physical damage for 5s."]

	t.useDuration = 20;

	t.use = function(time, user, target) {
		if (time == 0) {
			user.wobbleV += 3;
			user.inflictBuff(new bfPhysImmune(5*60));
		}
	}
}

abSpikedThorns = new function() {
	var t = this;
	t.type = "phys";
	t.cooldown = 14*60;

	t.ico = "thorn"
	t.name = "Spiked Thorns"
	t.description = ["Stuns the enemy for 3 seconds if", "damaged in the next .5 seconds.", "Tricky to use!"]

	t.useDuration = 20;

	t.use = function(time, user, target) {
		if (time == 0) {
			user.wobbleV += 3;
			user.inflictBuff(new bfSpikedThorns(30));
		}
	}
}

abReflect = new function() {
	var t = this;
	t.type = "phys";
	t.cooldown = 16*60;

	t.isReflect = true;
	t.ico = "reflect"
	t.name = "Reflect"
	t.description = ["Reflects all damage types for", "one second at 1.5x damage."]

	t.useDuration = 20;

	t.use = function(time, user, target) {
		if (time == 0) {
			user.wobbleV += 5;
			user.inflictBuff(new bfReflect(60));
		}
	}
}

abWeedKiller = new function() {
	var t = this;
	t.type = "phys";
	t.cooldown = 16*60;

	t.ico = "defense"
	t.name = "Weed Killer"
	t.description = ["The levels of industrial waste", "in this stuff is enough to halve",  "any damage taken for 4 seconds!"]

	t.useDuration = 20;

	t.use = function(time, user, target) {
		if (time == 0) {
			user.wobbleV += 5;
			user.inflictBuff(new bfWeedKiller(60*4));
		}
	}
}

abPhotosynthesis = new function() {
	var t = this;
	t.type = "phys";
	t.cooldown = 12*60;

	t.ico = "absorbfire"
	t.name = "Photosynthesis"
	t.description = ["Absorbs all fire damage as", "growth for 3 seconds."]

	t.useDuration = 20;

	t.use = function(time, user, target) {
		if (time == 0) {
			user.wobbleV += 7;
			user.inflictBuff(new bfPhotosynthesis(60*3));
		}
	}
}

abPoisonAbsorb = new function() {
	var t = this;
	t.type = "phys";
	t.cooldown = 12*60;

	t.ico = "absorbpsn"
	t.name = "Poison Absorb"
	t.description = ["Absorbs all poison damage as", "growth for 3 seconds."]

	t.useDuration = 20;

	t.use = function(time, user, target) {
		if (time == 0) {
			user.wobbleV += 7;
			user.inflictBuff(new bfPoisonAbsorb(60*3));
		}
	}
}

abBurstGrowth = new function() {
	var t = this;
	t.type = "phys";
	t.cooldown = 15*60;

	t.ico = "burstgrow"
	t.name = "Burst Growth"
	t.description = ["Channels a huge growth spurt", "for up to 3 seconds.", "Interrupted by hits."]

	t.useDuration = 60*3+10;

	t.use = function(time, user, target) {
		if (time == 0) {
			user.inflictBuff(new bfBurstTracker(60*3));
		} else if (time < 60*3) {
			user.wobble = Math.sin(time/4)*time/5;
			user.wobbleV = Math.sin(time/4)*time/5 - Math.sin((time-1)/4)*(time-1)/5;

			var bt = null;
			for (var i=0; i<user.buffs.length; i++) {
				if (user.buffs[i].isBurst) bt = user.buffs[i];
			}

			if (bt == null) {
				user.growth += 150+(time/(60*3))*1000;
				return true;
			}
		} else if (time == 60*3) {
			user.growth += 1300;
			debugger;
		}
	}
}

abFlashFreeze = new function() {
	var t = this;
	t.type = "phys";
	t.cooldown = 10*60;

	t.ico = "freeze"
	t.name = "Flash Freeze"
	t.description = ["Makes the user invulnerable for", "2 seconds, but unable to do", "anything. Purges all buffs."]

	t.useDuration = 60*2;

	t.use = function(time, user, target) {
		user.wobbleV = 0;
		if (time == 0) {
			user.buffs = [];
			user.inflictBuff(new bfInvuln(60*2));
		}
	}
}