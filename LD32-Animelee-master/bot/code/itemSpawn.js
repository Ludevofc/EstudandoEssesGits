function itemSpawn(scn, game, info) {

	var t = this;
	t.p = vec2.clone(info.p);
	t.r = info.r; //rarity

	var files = game.files;
	var localPickup = 0;
	t.img = files["img/itemSpawn.png"];
	t.inImg = files["img/itemSpawnIna.png"];

	t.update = update;
	t.render = render;
	var time = Math.random()*60;

	t.itemContain = -1;

	function update() {
		if (t.itemContain != -1 && localPickup <= 0) {
			for (var i=0; i<scn.players.length; i++) {
				var p = scn.players[i];
				if (p.net) continue;
				if (vec2.dist(p.p, [t.p[0], t.p[1]-15]) < 20) {
					p.setItem(t.itemContain, true);
					t.itemContain = -1;
					scn.sendItemUp(t);
					localPickup = 160;
				}
			}
		}

		time++;
		localPickup--;
	}

	function render(ctx) {
		ctx.save();
		ctx.translate(t.p[0], t.p[1])

		ctx.save();
		ctx.scale(0.5, 0.5);
		ctx.drawImage((t.itemContain == -1)?t.inImg:t.img, t.img.width/-2, -t.img.height+1);
		ctx.restore();

		ctx.translate(0, -24+4*Math.sin(time/30));

		if (t.itemContain != -1) {
			var def = ropeObjDefs[t.itemContain];

			ctx.textAlign = "center";
			ctx.font = "12px Trebuchet MS";
			ctx.fillStyle = "#FFFFFF";
			ctx.fillText(def.name, 0, -15);

			ctx.scale(0.25, 0.25);
			
			var img = files["img/"+def.name+".png"];
			ctx.drawImage(img, -img.width/2, -img.height/2);
		}


		

		//ctx.scale(0.25, 0.25);
		/*if (t.itemContain != -1) {
			var def = ropeObjDefs[t.itemContain];
			var imgs = animals[def.n];
			var seg = def.segments;
			var advance = Math.PI*1.5/seg.length;
			for (var i=0; i<seg.length; i++) {
				var s = seg[i];
				var img = imgs[i];
				if (i != 0) ctx.translate(-s.dist, 0);

				ctx.save();
				ctx.scale(0.5, 0.5);

				var downOff = (s.downOff == null)?0:s.downOff;
				ctx.drawImage(img, -img.width/2, (-img.height/2)+downOff*2);

				//var width = e.def.colSize*2+4

				//ctx.drawImage(img, Math.max(0, (imgPos-width/2)*2), 0, width*2, img.height, -width/2, -img.height/4, width, img.height/2); 

				ctx.restore();

				ctx.rotate(advance);
			}
		}*/

		ctx.restore();
	}

}