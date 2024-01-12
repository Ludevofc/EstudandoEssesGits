function ld34Instance(config, wss, onclose) {
	var onClose = onclose;
	var TICK_BUFFER_SIZE = 1;

	var userID = 0;
	var sockets = [];
	var userInf = [];
	var mode = -1;
	var lastTime = 0;
	var countTime = 0;
	var t = this;
	t.clients = 0;

	var buttonQueue = [];
	var tickQueue = [];
	var tickHistory = [];

	var upInt = setTimeout(update, 16.667);

	var lastFrame = Date.now();
	var behind = 0;

	function update() {
		var upInt = setTimeout(update, 16.667);
		if (t.clients < 2) {
			lastFrame = Date.now();
			return;
		}

		behind += Date.now() - lastFrame;
		lastFrame = Date.now();
		while (behind > 1000/60) {
			behind -= 1000/60;

			//perform tick
			var tick = {
				r: (Math.random()*0x7FFFFFFF)|0, //random seed
				q: [] //commands
			}

			for (var i=0; i<buttonQueue.length; i++) tick.q.push(buttonQueue[i]);
			buttonQueue = [];
			tickQueue.push(tick);
			tickHistory.push(tick);
			if (tickQueue.length>=TICK_BUFFER_SIZE) {
				broadcast({
					t: ">", //ticks
					q: tickQueue,
				})
				tickQueue = [];
			}
		}

		for (var i=0; i<sockets.length; i++) {
			if (lastFrame-sockets[i].lastMessage > 300*1000) sockets[i].close(); //rip in peace sweet prince
		}
	}

	function broadcast(p, except) {
		for (var i=0; i<sockets.length; i++) {
			if (sockets[i] != except) sockets[i].trySendJ(p);
		}
	}

	//HANDLERS BELOW

	function addUser(cli, after) {
		var c = JSON.parse(JSON.stringify(cli.credentials));
		c.active = true;
		cli.userID = userInf.length;
		userInf.push(c);

		if (after) broadcast({ t:"+", k:c }, cli)
	}

	function vetName(soc) {
		var name = soc.credentials.name;
		if (name == null || name == "") {
			soc.credentials.name = "Player"
		} else if (name.length > 32) {
			soc.credentials.name = name.substr(0, 32);
		}
	}

	this.addClient = function(clientSocket) {
		console.log(timestamp()+clientSocket.credentials.name+" joined the game! ("+clientSocket._socket.remoteAddress+")");
		vetName(clientSocket);
		sockets.push(clientSocket);
		t.clients++;
		clientSocket.credentials.userID = userID++;

		addUser(clientSocket, true);

		if (mode == -1) {
			startGame();
		}

		sendInstanceInfo(clientSocket);
	}

	function startGame() {
		mode = 0; //countdown mode
		countTime = 0;

	}

	function sendInstanceInfo(clientSocket) {
		clientSocket.trySendJ({
			t:"*",
			m:mode,
			k:userInf,
			p:clientSocket.userID,
		});
		clientSocket.trySendJ({
			t: ">", //ticks
			q: tickHistory,
		})
	}

	function timestamp() {
		return "["+(new Date()).toLocaleTimeString()+"] ";
	}

	this.removeClient = function(clientSocket) {
		//attempt to remove client -- may not be in this instance!
		var ind = sockets.indexOf(clientSocket);
		if (ind != -1) {
			console.log(timestamp()+clientSocket.credentials.name+" left the game!");
			sockets.splice(ind, 1); //shouldn't cause any problems.

			if (clientSocket.userID != null) {
				//tell all other clients that this client is now inactive.
				var dat = {
					t:"-",
					k:clientSocket.userID
				};
				userInf[clientSocket.userID].active = false;
				broadcast(dat);
			}

			if (sockets.length == 0) {
				console.log("All players have left. Server is now IDLE!")
				if (onClose != null) onClose(t);
				t.resetInstance();
			}
		}
	}

	function toArrayBuffer(buffer) { //why are you making my life so difficult :(
		var ab = new ArrayBuffer(buffer.length);
		var view = new Uint8Array(ab);
		for (var i = 0; i < buffer.length; ++i) {
			view[i] = buffer[i];
		}
		return ab;
	}

	function clamp(x, a, b) {
		return Math.min(b, Math.max(a, x));
	}

	this.handleMessage = function(cli, data, flags) {
		if (sockets.indexOf(cli) == null) {
			socket.send(JSON.stringify(
				{
					t: "!",
					m: "FATAL ERROR: Server does not recognise client! Are you connecting to the wrong instance?"
				}
			));
		} else {
			var d = toArrayBuffer(data);
			if (flags.binary) {
				//binary data
				var view = new DataView(d);
				var handler = binH[view.getUint8(0)];
				if (handler != null) handler(cli, view);
			} else {

				//JSON string
				var obj;
				try {	
					obj = JSON.parse(data);
				} catch (err) {
					debugger; //packet recieved from server is bad
					return;
				}
				var handler = wsH["$"+obj.t];
				if (handler != null) handler(cli, obj);
			}
		}
	}

	var wsH = {};
	wsH["$b"] = function(cli, obj) { //button state change
		//add to button queue.
		buttonQueue.push({
			t: "b", //button type
			c: cli.credentials.userID, 
			b: clamp(obj.b, 0, 1), //button index. 0 or 1.
			d: clamp(obj.d, 0, 1) //up or down
		});
	}

	var binH = [];

	this.resetInstance = function() {
		console.log("\x00"+timestamp()+"instance reset")
		userID = 0;
		mode = -1;
		userInf = [];

		buttonQueue = [];
		tickHistory = [];
		tickQueue = [];
		for (var i=0; i<sockets.length; i++) {
			addUser(sockets[i], false);
			sockets[i].credentials.userID = userID++; //reassign user IDs to clients.
		}
		if (sockets.length > 0) {
			if (mode == -1) {
				startGame();
			}
		}
		for (var i=0; i<sockets.length; i++) sendInstanceInfo(sockets[i]);
	}
}

exports.ld34 = ld34Instance;