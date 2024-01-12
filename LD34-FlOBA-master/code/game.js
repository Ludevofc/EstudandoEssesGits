//basically the entry point for the game.

var AudioContext = window.AudioContext || window.webkitAudioContext || window.MozAudioContext;

function game(canvas) {
	var t = this;

	//set up 2d canvas
	t.ctx = canvas.getContext("2d");
	var ctx = t.ctx;
	t.ctx.canvas = canvas; //convenient reference
	t.canvas = canvas;

	//set up audio
	t.ac = new AudioContext();
	globalAudio = t.ac; //fuck it
	t.outGain = t.ac.createGain();
	t.outGain.connect(t.ac.destination);

	document.body.addEventListener("keydown", keyDown);
	document.body.addEventListener("keyup", keyUp);

	var keyMap = [];
	keyMap[90] = 0; //z is action button
	keyMap[39] = 1; //right cycles menus
	keyMap[88] = 1; //x also cycles menus

	t.keyArray = [[0,0], [0,0]]
	var keyLast = [[0,0], [0,0]]
	t.keyPress = [[0,0], [0,0]]

	t.netFacade = null;

	var tickQueue = [];

	t.res = new res(init);
	t.activeScene = null;

	function init() {

		t.rng = new rng(0);

		requestAnimationFrame(render);
		t.netFacade = new netFacade("ws://freeso.org:8081", {
			onEnter: function() {
				console.log("we in there");
				t.activeScene = new pick1Scene(t)
				t.activeScene.init();
			},
			recvTicks: function(t) {
				for (var i=0; i<t.length; i++) {
					tickQueue.push(t[i]);
				}
			}
		});

	}

	function render() {
		//handle key presses

		var runTicks = (tickQueue.length>0)?1:0;
		if (tickQueue.length > 12) runTicks = tickQueue.length;
		else if (tickQueue.length > 9) runTicks = 4;
		else if (tickQueue.length > 5) runTicks = 3;
		else if (tickQueue.length > 3) runTicks = 2;

		for (var i=0; i<runTicks; i++) update(tickQueue[i]);
		tickQueue.splice(0, runTicks);

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (t.activeScene != null) t.activeScene.render(t.ctx);

		requestAnimationFrame(render);
	}

	function update(tick) {
		//run tick command

		t.rng.state = tick.r;

		for (var i=0; i<tick.q.length; i++) {
			var cmd = tick.q[i];
			switch (cmd.t) {
				case "b":
					//button trigger
					if (cmd.c>1) continue;
					t.keyArray[cmd.c][cmd.b] = cmd.d;
			}
		}
		for (var j=0; j<2; j++) {
			for (var i=0; i<2; i++) t.keyPress[j][i] = (t.keyArray[j][i] && !keyLast[j][i]);
		}
		keyLast = [[t.keyArray[0][0], t.keyArray[0][1]], [t.keyArray[1][0], t.keyArray[1][1]]];

		if (t.activeScene != null) t.activeScene.update(t.ctx);
	}

	function keyDown(e) {
		var key = keyMap[e.keyCode];
		if (key != null) {
			t.netFacade.sendPacket({
				t:"b",
				b:key,
				d:1
			})
		}
	}

	function keyUp(e) {
		var key = keyMap[e.keyCode];
		if (key != null) {
			t.netFacade.sendPacket({
				t:"b",
				b:key,
				d:0
			})
		}
	}
}