//network facade

var WebSocket = window.WebSocket || window.MozWebSocket;

function netFacade(url, listeners) {
	var t = this;

	var ws = new WebSocket(url);
	ws.binaryType = "arraybuffer";

	t.ws = ws
	t.clientID = -1;

	//exposed listenables
	t.onDisconnect = listeners.onDisconnect;
	t.recvTicks = listeners.recvTicks; //returns array of ticks
	t.onConnect = listeners.onConnect;
	t.onEnter = listeners.onEnter;

	ws.onerror = function(e) {
		alert("NETWORK ERROR: "+e)
	}

	ws.onclose = function(e) {
		alert("Lost connection!");
		if (t.onDisconnect != null) t.onDisconnect();
	}

	ws.onopen = function() {
		var obj = {
			t:"*",
			i:0,
			c:{
				name:"Player"
			}
		}
		sendPacket(obj);
	};

	ws.onmessage = function(evt) {
		var d = evt.data;
		if (typeof d != "string") {
			//binary data. we don't use this.
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

	//websockets handlers

	function sendPacket(obj) {
		ws.send(JSON.stringify(obj));
	}
	t.sendPacket = sendPacket;

	var wsH = {};

	wsH["$*"] = function(obj) { //initiate scene.
		t.mode = obj.m;
		t.clientID = obj.p;
		if (t.onEnter != null) t.onEnter(obj);
	}

	wsH["$>"] = function(obj) { //game ticks
		if (t.recvTicks != null) t.recvTicks(obj.q);
	}
}