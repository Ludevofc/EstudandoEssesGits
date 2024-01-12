//pseudo rng
//based off of code from stack overflow
//thanks stack overflow
//http://stackoverflow.com/questions/424292/seedable-javascript-random-number-generator

function rng(seed) {
	var t = this;
	t.m = 0x80000000; // 2**31;
	t.a = 1103515245;
	t.c = 12345;

	t.state = seed;

	t.nextInt = function() {
		console.log(t.state);
		t.state = (t.a * t.state + t.c) % t.m;
		return t.state;
	}
}