
function abilityIcon(scene, ability, position) {
	var t = this;
	var scene = scene;
	var res = scene.res;

	t.init = init;
	t.update = update;
	t.render = render;

	t.p = position;

	t.cdMax = 10;
	t.cd = 0;
	t.pulse = 0;
	t.sel = -1;

	var osc = 0;
	var oscrate = ((scene.game.rng.nextInt()%100)/100)*0.05+0.1

	function init() {

	}

	function update() {
		osc += oscrate;
		t.pulse -= t.pulse/5;
	}

	function render(ctx) {
		ctx.save();
		ctx.translate(t.p[0], t.p[1]);
		ctx.rotate(Math.sin(osc)*0.02);
		ctx.scale(1+t.pulse, 1+t.pulse	)

		if (t.sel != -1) ctx.globalAlpha = 0.5;

		var img = res.img["ico/"+ability.ico+".png"];
		ctx.drawImage(img, img.width/-2, img.width/-2);

		var cdOverlay;
		if (img.width == 128) cdOverlay = res.img["ico/ultCD.png"];
		else cdOverlay = res.img["ico/normalCD.png"];

		var cdI = 1-(t.cd/t.cdMax);

		if (cdI < 1) {
			ctx.beginPath();
			ctx.arc(0, 0, 100, -0.5*Math.PI, (-0.5+(cdI*2)) * Math.PI, true);
			ctx.lineTo(0,0);
			ctx.clip();
			ctx.drawImage(cdOverlay, cdOverlay.width/-2, cdOverlay.width/-2);
		}

		ctx.globalAlpha = 1;

		ctx.restore();
	}
}