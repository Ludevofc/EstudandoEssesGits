
function genericSelector(scene, positions, scales, controller) {
	var t = this;
	var scene = scene;
	var res = scene.res;

	t.init = init;
	t.update = update;
	t.render = render;

	t.positions = positions;
	t.scales = scales;

	t.index = 0;
	t.p = t.positions[0];
	t.s = t.scales[0];
	t.disabled = false;

	//public events
	t.onSelect = null;
	t.onChange = null;

	var osc = 0;

	function init() {

	}

	function update() {
		t.p = [
			t.p[0] + (t.positions[t.index][0]-t.p[0])/5,
			t.p[1] + (t.positions[t.index][1]-t.p[1])/5,
		]
		t.s += (t.scales[t.index]-t.s)/5
		osc += 0.1;

		var pressed = scene.game.keyPress[controller];
		if (!t.disabled) {
			if (pressed[1]) {
				t.index = (t.index + 1) % t.positions.length;
				if (t.onChange != null) t.onChange();
			}
			if (pressed[0] && t.onSelect != null) t.onSelect();
		}
	}

	function render(ctx) {
		ctx.save();
		var scale = t.s+Math.sin(osc)*0.02;
		ctx.translate(t.p[0], t.p[1]);
		ctx.scale(scale, scale);

		if (t.disabled) ctx.globalAlpha = 0.3;
		var img = res.img["select.png"];
		ctx.drawImage(img, img.width/-2, img.width/-2);
		ctx.globalAlpha = 1;

		ctx.restore();
	}
}