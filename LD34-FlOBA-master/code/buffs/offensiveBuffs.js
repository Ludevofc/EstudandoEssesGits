//some buffs

bfStun = function(duration) {
	var t = this;
	t.duration = duration;
	t.time = duration;

	t.getName = function() { return "Stunned"; }
	t.debuff = true;

	t.isStunned = function() { return true; }
	t.onAbility = function(me, other, ability, cd) { return cd }
	t.isStunted = function() { return false; }

	t.onHit = function(me, other, ability, damage) { return damage; }
	t.onTick = function(me, other) { return true; }
	t.abilityDisabled = function(ability) {}

}

bfFlaming = function() {
	var t = this;
	t.duration = 7*60;
	t.time = 7*60;
	t.stacks = 1;

	t.getName = function() { return "Flaming Oil "+t.stacks+"x"; }
	t.flamOil = true;
	t.debuff = true;
	t.kill = false;

	t.isStunned = function() { return false; }
	t.onAbility = function(me, other, ability, cd) { return cd; }
	t.isStunted = function() { return false; }

	t.onHit = function(me, other, ability, damage) { return (ability == abFlaming)?damage*(1+t.stacks*0.5):damage; }

	t.onDeflect = function(me, other, ability, damage) { if (ability == abFlaming) t.kill = true; }
	t.onTick = function(me, other) { return !t.kill; }
	t.abilityDisabled = function(ability) {}
}

bfGetMad = function() {
	var t = this;
	t.duration = 7*60;
	t.time = 7*60;

	t.kill = false;

	t.getName = function() { return "Get Mad"; }
	t.debuff = false;

	t.isStunned = function() { return false; }
	t.onAbility = function(me, other, ability, cd) { 

		return cd;
	}
	t.isStunted = function() { return false; }

	t.onInflict = function(me, other, ability, damage) { 
		if (ability.type == "phys") {
			other.damage(abGetMad, damage);
			t.kill = true
		}
		return damage;
	}
	t.onHit = function(me, other, ability, damage) { return damage; }
	t.onTick = function(me, other) { return !t.kill; }
	t.abilityDisabled = function(ability) {}
}

bfFlamingSpores = function() {
	var t = this;
	t.duration = 3*60;
	t.time = 3*60;

	t.getName = function() { return "On Fire"; }
	t.debuff = true;

	t.isStunned = function() { return false; }
	t.onAbility = function(me, other, ability, cd) { 

		return cd;
	}
	t.isStunted = function() { return false; }
	t.onHit = function(me, other, ability, damage) { return damage; }
	t.onTick = function(me, other) { 
		if (t.time%20 == 0) {
			//hits 9 times
			other.wobbleV -= 1;
			other.damage(abFlamingSpores, 50);
		} 
		return true; 
	}
	t.abilityDisabled = function(ability) {}
}

bfPoisonSpikes = function() {
	var t = this;
	t.duration = 5*60;
	t.time = 5*60;

	t.getName = function() { return "Poison Spikes"; }
	t.debuff = true;

	t.isStunned = function() { return false; }
	t.onAbility = function(me, other, ability, cd) { 
		me.damage(abPoisonSpikes, 150);
		return cd;
	}
	t.isStunted = function() { return false; }
	t.onHit = function(me, other, ability, damage) { return damage; }
	t.onTick = function(me, other) { me.spikes = (t.time > 1); return true; }
	t.abilityDisabled = function(ability) {}
}

bfAcidRain = function() {
	var t = this;
	t.duration = 3*60+20;
	t.time = 3*60+20;

	t.getName = function() { return "Acid Rain"; }
	t.debuff = true;

	t.isStunned = function() { return false; }
	t.onAbility = function(me, other, ability, cd) { 

		return cd;
	}
	t.isStunted = function() { return false; }
	t.onHit = function(me, other, ability, damage) { return damage; }
	t.onTick = function(me, other) { 
		if (t.time%20 == 0) {
			//hits 10 times
			me.wobbleV -= 1;
			me.damage(abAcidRain, me.growth/100);
		}
		return true;
	}
	t.abilityDisabled = function(ability) {}
}

bfSlowToxin = function() {
	var t = this;
	t.duration = 3*60;
	t.time = 3*60;

	t.getName = function() { return "Slow Toxin"; }
	t.debuff = true;

	t.isStunned = function() { return false; }
	t.onAbility = function(me, other, ability, cd) { 
		return cd*1.5;
	}
	t.isStunted = function() { return false; }
	t.onHit = function(me, other, ability, damage) { return damage; }
	t.onTick = function(me, other) { return true; }
	t.abilityDisabled = function(ability) {}
}

bfNeurotoxin = function() {
	var t = this;
	t.duration = 5*60;
	t.time = 5*60;

	t.getName = function() { return "Growth Stunted"; }
	t.debuff = true;

	t.isStunned = function() { return false; }
	t.onAbility = function(me, other, ability, cd) { 
		return cd;
	}
	t.isStunted = function() { return true; }
	t.onHit = function(me, other, ability, damage) { return damage; }
	t.onTick = function(me, other) { return true; }
	t.abilityDisabled = function(ability) {}
}