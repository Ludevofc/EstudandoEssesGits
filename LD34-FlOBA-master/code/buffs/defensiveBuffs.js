//defensive buffs

bfFireImmune = function(duration) {
	var t = this;
	t.duration = duration;
	t.time = duration;

	t.getName = function() { return "Sprinkler Shield"; }
	t.debuff = false;

	t.isStunned = function() { return false; }
	t.onAbility = function(me, other, ability, cd) { return cd }
	t.isStunted = function() { return false; }

	t.onHit = function(me, other, ability, damage) { return (ability.type=="fire")?0:damage; }
	t.onTick = function(me, other) { return true; }
	t.abilityDisabled = function(ability) {}
}

bfPoisonImmune = function(duration) {
	var t = this;
	t.duration = duration;
	t.time = duration;

	t.getName = function() { return "Immuno-Shield"; }
	t.debuff = false;

	t.isStunned = function() { return false; }
	t.onAbility = function(me, other, ability, cd) { return cd }
	t.isStunted = function() { return false; }

	t.onHit = function(me, other, ability, damage) { return (ability.type=="psn")?0:damage; }
	t.onTick = function(me, other) { return true; }
	t.abilityDisabled = function(ability) {}
}

bfPhysImmune = function(duration) {
	var t = this;
	t.duration = duration;
	t.time = duration;

	t.getName = function() { return "Tough Skin"; }
	t.debuff = false;

	t.isStunned = function() { return false; }
	t.onAbility = function(me, other, ability, cd) { return cd }
	t.isStunted = function() { return false; }

	t.onHit = function(me, other, ability, damage) { return (ability.type=="phys")?0:damage; }
	t.onTick = function(me, other) { return true; }
	t.abilityDisabled = function(ability) {}
}

bfSpikedThorns = function(duration) {
	var t = this;
	t.duration = duration;
	t.time = duration;

	t.getName = function() { return "Spiked Thorns"; }
	t.debuff = false;
	t.kill = false;

	t.isStunned = function() { return false; }
	t.onAbility = function(me, other, ability, cd) { return cd }
	t.isStunted = function() { return false; }

	t.onHit = function(me, other, ability, damage) { 
		if (ability.type == "phys") {
			t.kill = true;
			other.inflictBuff(new bfStun(2*60));
		}
		return (ability.type=="phys")?0:damage; 
	}
	t.onTick = function(me, other) { 
		me.thorns = (t.time>1);
		return !t.kill; 
	}
	t.abilityDisabled = function(ability) {}
}

bfReflect = function(duration) {
	var t = this;
	t.duration = duration;
	t.time = duration;

	t.getName = function() { return "Reflect"; }
	t.debuff = false;
	t.kill = false;

	t.isStunned = function() { return false; }
	t.onAbility = function(me, other, ability, cd) { return cd }
	t.isStunted = function() { return false; }

	t.onHit = function(me, other, ability, damage) { 
		if (!ability.isReflect) {
			other.damage(abReflect, damage*1.5);
			other.wobbleV -= 4;
		}
		return 0; 
	}
	t.onTick = function(me, other) { return !t.kill; }
	t.abilityDisabled = function(ability) {}
}

bfWeedKiller = function(duration) {
	var t = this;
	t.duration = duration;
	t.time = duration;
	t.isReflect = true;

	t.getName = function() { return "Half Damage"; }
	t.debuff = false;
	t.kill = false;

	t.isStunned = function() { return false; }
	t.onAbility = function(me, other, ability, cd) { return cd }
	t.isStunted = function() { return false; }

	t.onHit = function(me, other, ability, damage) { 
		return damage/2; 
	}
	t.onTick = function(me, other) { return !t.kill; }
	t.abilityDisabled = function(ability) {}
}


bfPhotosynthesis = function(duration) {
	var t = this;
	t.duration = duration;
	t.time = duration;

	t.getName = function() { return "Photosynthesis"; }
	t.debuff = false;
	t.kill = false;

	t.isStunned = function() { return false; }
	t.onAbility = function(me, other, ability, cd) { return cd }
	t.isStunted = function() { return false; }

	t.onHit = function(me, other, ability, damage) { 
		return (ability.type == "fire")?(-1*damage):damage; 
	}
	t.onTick = function(me, other) { return !t.kill; }
	t.abilityDisabled = function(ability) {}
}

bfPoisonAbsorb = function(duration) {
	var t = this;
	t.duration = duration;
	t.time = duration;

	t.getName = function() { return "Poison Absorb"; }
	t.debuff = false;
	t.kill = false;

	t.isStunned = function() { return false; }
	t.onAbility = function(me, other, ability, cd) { return cd }
	t.isStunted = function() { return false; }

	t.onHit = function(me, other, ability, damage) { 
		return (ability.type == "psn")?(-1*damage):damage; 
	}
	t.onTick = function(me, other) { return !t.kill; }
	t.abilityDisabled = function(ability) {}
}


bfBurstTracker = function(duration) {
	var t = this;
	t.duration = duration;
	t.time = duration;

	t.getName = function() { return "Burst Growth"; }
	t.debuff = false;
	t.kill = false;
	t.isBurst = true;

	t.isStunned = function() { return false; }
	t.onAbility = function(me, other, ability, cd) { return cd }
	t.isStunted = function() { return false; }

	t.onHit = function(me, other, ability, damage) { 
		t.kill = true;
		return damage; 
	}
	t.onTick = function(me, other) { return !t.kill; }
	t.abilityDisabled = function(ability) {}
}