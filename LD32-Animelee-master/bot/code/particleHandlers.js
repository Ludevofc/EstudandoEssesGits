var sparkStates = [
	[255, 255, 255, 1],
	[255, 198, 0, 1],
	[254, 77, 1, 1],
	[153, 0, 0, 1],
	[0, 0, 0, 0]
]

window.pHandlers = new (function() {

	var t = this;

	t.update = [
		//TYPE 0: spark
		function(scn, d) {
			d.v[1] += GRAVITY;
			if (d.lp == null) d.lp = vec2.create();
			d.lp[0] = d.p[0];
			d.lp[1] = d.p[1];
			if (d.colC == null) d.colC = 0;
			d.colC += 0.03333332;

			var steps = 0;
			var remainingT = 1;
			var velSeg = vec2.clone(d.v);
			var posSeg = vec2.clone(d.p);
			while (steps++ < 3 && remainingT > 0.01) {
				var result = collider.raycast(posSeg, velSeg, scn.quad.getLines(d.p));
				if (result != null) {
					//COL RESPONSE

					var n = result.normal;
					var proj = vec2.dot(d.v, n)*1.5;
					vec2.sub(d.v, d.v, vec2.scale(vec2.create(), n, proj));

					vec3.add(posSeg, posSeg, vec3.scale(vec3.create(), velSeg, result.t));
					vec3.add(posSeg, vec3.scale([], n, 0.05), result.colPoint);

					//END COL RESPONSE

					remainingT -= result.t;
					if (remainingT > 0.01) {
						vec2.scale(velSeg, d.v, remainingT);
					}
				} else {
					vec2.add(posSeg, posSeg, velSeg);
					remainingT = 0;
				}
			}
			d.p = posSeg;
			if (--d.t <= 0) return true;
		},

		//TYPE 1: explosion
		function(scn, d) {
			if (d.delay-- > 0) return false;
			d.t += d.tv;
			if (d.t>=1) return true;
		},
	];


	t.render = [
		function(ctx, scn, p) {
			if (p.colC == null) p.colC = 0;
			var sC = sparkStates[Math.floor(p.colC)]
			var eC = sparkStates[Math.min(sparkStates.length-1, Math.ceil(p.colC))]
			var i = p.colC%1
			ctx.strokeStyle = "rgba("+Math.round(sC[0]*(1-i)+eC[0]*i)+", "+Math.round(sC[1]*(1-i)+eC[1]*i)+", "+Math.round(sC[2]*(1-i)+eC[2]*i)+", "+(sC[3]*(1-i)+eC[3]*i)+")";

			ctx.beginPath();
			ctx.lineWidth = 2;
			//TODO: factor camera movements
			ctx.moveTo(p.lp[0], p.lp[1]);
			ctx.lineTo(p.p[0], p.p[1]);
			ctx.stroke();
		},

		//TYPE 1: explosion
		function(ctx, scn, p) {
			if (p.delay > 0) return false;
			ctx.beginPath();
			var outer = p.radius*Math.sqrt(p.t)
			var inner = (p.radius*Math.sqrt((p.t-0.5)*2))

			if (p.t > 0.5) {
				ctx.arc(p.p[0], p.p[1], outer-((outer-inner)/2), 0, 2*Math.PI);
				ctx.lineWidth = (outer-inner)
				ctx.strokeStyle = p.col;
				ctx.stroke();
				ctx.lineWidth = 1;
			} else {
				ctx.arc(p.p[0], p.p[1], outer, 0, 2*Math.PI);
				ctx.fillStyle = p.col;
				ctx.fill();
			}
		}
	];

})();