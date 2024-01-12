//sun entity

function sun(scene, position) {
	var t = this;
	var scene = scene;
	var res = scene.res;

	t.init = init;
	t.update = update;
	t.render = render;

	t.p = position;

	var osc = 0;
	var osc2 = 0;

	function init() {

	}

	function update() {
		osc += Math.PI/180;
		osc2 += Math.PI/37;
	}

	function render(ctx) {
		ctx.save();
		ctx.translate(t.p[0], t.p[1]);

		ctx.save();
		ctx.rotate(osc);

		ctx.save();
		ctx.rotate(osc2);
		ctx.translate(2,0);
		ctx.rotate(-osc2);
		var img = res.img["sunflare.png"];
		ctx.drawImage(img, img.width/-2, img.width/-2);

		ctx.restore();

		var img = res.img["sun.png"];
		ctx.drawImage(img, img.width/-2, img.width/-2);

		ctx.restore();

		ctx.translate(0, Math.sin(osc)*4);

		var img = res.img["sface/c1.png"];
		ctx.drawImage(img, img.width/-2, img.width/-2);

		ctx.restore();
	}
}