function cog(scn, game, info) {

	var t = this;

	t.update = update;
	t.render = render;
	t.p = vec2.clone(info.p);

	var files = game.files;
	var img = (info.h)?files["img/halfcog.png"]:files["img/cog.png"];

	t.size = info.size;
	t.rot = info.rot;
	t.rotVel = info.rotVel;

	function update() {
		for (var i=0; i<scn.players.length; i++) {
			var p = scn.players[i];
			if (p.net) continue;
			if (vec2.dist(p.p, t.p) < t.size/2+12) {
				p.damage(100, "cog", -1);
			}
		}

		t.rot += t.rotVel;
	}

	function render(ctx) {
		ctx.save();

		ctx.translate(t.p[0], t.p[1]);

		ctx.scale(t.size/400, t.size/400);
		ctx.rotate(t.rot);
		ctx.drawImage(img, -200, -200);

		ctx.restore();
	}
}