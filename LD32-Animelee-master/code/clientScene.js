function clientScene(game) {	
	var t = this;

	t.render = render;
	t.update = update;
	t.sendPacket = sendPacket;

	var WebSocket = window.WebSocket || window.MozWebSocket;
	var ws = new WebSocket("ws://46.101.67.219:8081");
	ws.binaryType = "arraybuffer";

	t.ws = ws;
	t.mode = -1;
	var child = null;

	ws.onerror = function(e) {
		alert("NETWORK ERROR: "+e)
	}

	ws.onclose = function(e) {
		alert("disconnected");
		if (child != null) child.disconnected = true;
	}

	ws.onopen = function() {
		var obj = {
			t:"*",
			i:0,
			c:{
				name:window.prompt("What is your name?"),
				//send any other relevant credentials
			}
		}
		sendPacket(obj);
	};

	ws.onmessage = function(evt) {
		var d = evt.data;
		if (typeof d != "string") {
			//...
		} else {
			//JSON string
			var obj;
			try {	
				obj = JSON.parse(d);
			} catch (err) {
				debugger; 
				return;
			}
			var handler = wsH["$"+obj.t];
			if (handler != null) handler(obj);
		}
	}

	t.ws = ws;

	//fall through to child scene

	function update() {
		if (child != null) {	
			child.update();
		}
	}

	function render(ctx) {
		if (child != null) {
			child.render(ctx);
		}
	}

	//websockets handlers

	function sendPacket(obj) {
		ws.send(JSON.stringify(obj));
	}

	var wsH = {};

	wsH["$*"] = function(obj) { //initiate scene.
		t.mode = obj.m;
		setUpLevel("lvl1", obj);
		child.setMode(obj.m);
		child.updateItems(obj.i);
	}

	wsH["$m"] = function(obj) {
		child.setMode(obj.m);
	}

	wsH["$i"] = function(obj) {
		console.log("updating items")
		child.updateItems(obj.i);
	}

	wsH["$^"] = function(obj) { //tick
		if (child != null) {
			child.time = obj.s;
			console.log(obj.s+" seconds")
		}
	}

	wsH["$p"] = function(obj) { //update players
		//if (child.mode != 1) return;
		for (var i=0; i<obj.d.length; i++) {
			var d = obj.d[i];
			var o = child.players[d.k];
			if (!o.net || !o.active) continue;

			o.p = d.p;
			o.v = d.v;
			o.input = d.i;
			o.groundTime = d.g;
			o.wallTime = d.w;
			o.wallNorm = d.wN;
			o.upPress = d.u; 

			//d.N = rope definition number
			//d.R = rope segments (minus def, that is provided by us)

			o.deadTimer = d.d;
			o.hp = d.h;

			o.kills = d.K;
			o.assists = d.a;
			o.deaths = d.D;

			o.ropeWep = d.N;
			o.ropeHitter.loadState(d.N, d.R);
		}
	}

	wsH["$x"] = function(obj) {
		if (obj.c[1] != "cog") child.players[obj.c[0]].kills++;
		console.log(obj.c[0])
		child.players[obj.o].animatedDie();
	}


	wsH["$+"] = function(obj) { //add player
		console.log("player added");
		var p = new Player(child, game, [400, 300], true);
		child.addPlayer(p);
		p.active = obj.k.active;
		p.name = obj.k.name;
		p.cred = obj.k;
	}

	wsH["$-"] = function(obj) { //player disconnect.
		var ply = child.players[obj.k];
		ply.active = false;
		child.removeEntity(ply.ropeHitter);
		ply.ropeHitter = null;
	}

	function setUpLevel(level, obj) {
		if (child != null) child.kill();
		child = new gameScene(game, t)
		t.child = child;
		child.loadLevel(level);

		for (var i=0; i<obj.k.length; i++) {
			var p = new Player(child, game, child.levelInfo.respawns[Math.floor(Math.random()*child.levelInfo.respawns.length)], !(i == obj.p));
			child.addPlayer(p);
			p.active = obj.k[i].active;
			p.name = obj.k[i].name;
			p.cred = obj.k[i]
		}
	}

	var binH = {};
}