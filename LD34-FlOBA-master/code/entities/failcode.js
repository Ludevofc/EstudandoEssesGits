//failcode display

function failcode(scene) {
	var t = this;
	var scene = scene;
	var res = scene.res;

	t.init = init;
	t.update = update;
	t.render = render;

	t.displayFail = displayFail;

	var t = 90;
	var failMsg = "";

	codes = [
		"uh, success? what?",
		"BUSY!!",
		"STUNNED!!",
		"NOT READY YET!!"
	]

	function init() {

	}

	function displayFail(code) {
		failMsg = codes[code];
		t = 0;
	}

	function update() {
		if (t<90) {
			t++;
		}
	}

	function render(ctx) {
		if (t >= 90) return;
		ctx.save();
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = "bold 48px Trebuchet MS";
		ctx.fillStyle = "white";
		ctx.strokeStyle = "#B22D00";
		ctx.lineWidth = 14;

		ctx.translate(320, 470*2);

		var scale, alpha;
		if (t < 20) {
			scale = 2-Math.sin((t/40*Math.PI));
			alpha = t/20;
		} else if (t > 70) {
			scale = Math.sin(((90-t)/40*Math.PI));
			alpha = (90-t)/20;
		} else {
			scale = 1; alpha = 1;
		}
		ctx.scale(scale, scale);
		ctx.globalAlpha = alpha;
		ctx.strokeText(failMsg, 0, 0);
		ctx.fillText(failMsg, 0, 0);
		ctx.textAlign = "left";
		ctx.textBaseline = "alphabetic";
		ctx.globalAlpha = 1;
		ctx.restore();
	}
}