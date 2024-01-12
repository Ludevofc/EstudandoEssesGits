//ultimate buffs

bfInvuln = function(duration) {
	var t = this;
	t.duration = duration;
	t.time = duration;

	t.getName = function() { return "INVULNERABLE"; }
	t.debuff = false;
	t.kill = false;

	t.isStunned = function() { return false; }
	t.onAbility = function(me, other, ability, cd) { return cd }
	t.isStunted = function() { return false; }

	t.onHit = function(me, other, ability, damage) { 
		return 0; 
	}
	t.onTick = function(me, other) { return !t.kill; }
	t.abilityDisabled = function(ability) {}
}

bfLevel = function(duration) {
	var t = this;
	t.duration = duration;
	t.time = duration;

	var mtarget = null;
	var otarget = null;

	t.getName = function() { return "LEVELLING"; }
	t.debuff = false;
	t.kill = false;

	t.isStunned = function() { return false; }
	t.onAbility = function(me, other, ability, cd) { return cd }
	t.isStunted = function() { return false; }

	t.onHit = function(me, other, ability, damage) { return damage; }
	t.onTick = function(me, other) { 

		if (mtarget == null) {
			mtarget = me.growth + (other.growth - me.growth)/3;
			otarget = other.growth + (me.growth - other.growth)/3;
		}

		me.growth += (mtarget-me.growth)/20;
		other.growth += (otarget-other.growth)/20;
		return !t.kill; 
	}
	t.abilityDisabled = function(ability) {}
}

bfSpeedyGrowth = function(duration) {
	var t = this;
	t.duration = duration;
	t.time = duration;

	t.getName = function() { return "SPEEDY GROWTH"; }
	t.debuff = false;
	t.kill = false;

	t.isStunned = function() { return false; }
	t.onAbility = function(me, other, ability, cd) { return cd }
	t.isStunted = function() { return false; }

	t.onHit = function(me, other, ability, damage) { return damage}
	t.onTick = function(me, other) { 
		me.growth += 6;
		return !t.kill; 
	}
	t.abilityDisabled = function(ability) {}
}