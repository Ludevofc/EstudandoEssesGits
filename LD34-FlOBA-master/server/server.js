// dedicated server for gardening growy game
// boilerplate code based off of Snoverchill, for more game specifics see the instance script

// Default config:
var defaultCfg = {
	port:8081,
}

process.title = "LD34 Dedicated Server";

console.log("Initializing server...");
try {
	var ws		= require('ws'),
  	http		= require('http'),
  	fs			= require('fs'),
  	inst 		= require('./ld34Instance.js');
} catch (err) {
	console.error("FATAL ERROR - could not load modules. Ensure you have ws for websockets.");
	console.log(err);
	process.exit(1);
}
console.log("Modules Ready!");

try {
	var config = JSON.parse(fs.readFileSync('config.json', 'ascii'));
} catch (err) {
	console.log(err.errno)
	if (err.errno == 34 || err.errno == -4058) { //???
		console.error("No config file. Writing default config.");
		fs.writeFileSync('config.json', JSON.stringify(defaultCfg, null, "\t"), 'ascii')
		var config = JSON.parse(fs.readFileSync('config.json', 'ascii'));
	} else {
		console.error("FATAL ERROR - could not load config. Check that the syntax is correct.");
		process.exit(1);
	}
}

var wss = new ws.Server({port: config.port});

var instances = [];

function instClose(inst) {
	for (var i=0; i<instances.length; i++) {
		if (instances[i] == inst) instances.splice(i--, 1)
	}
}

wss.on('connection', function(cli) {
	// here things are a little different, there should be many instances. 
	// Anyone to join after player 2 should be a spectator.

	cli.on('message', function(data, flags) {
		cli.lastMessage = Date.now();
		if (cli.inst == null) {
			if (flags.binary) cli.close(); //first packet must identify location.
			else {
				try {
					var obj = JSON.parse(data);
					if (obj.t == "*") { //instance identifier
						cli.credentials = obj.c;


						//find a free instance. create one if it does not exist.
						var instR = null;
						for (var i=0; i<instances.length; i++) {
							if (instances[i].clients < 2) instR = instances[i];
						}

						if (instR == null) {
							instR = new inst.ld34(config, wss, instClose);
							instances.push(instR);
						}

						//var inst = instances[obj.i];
						//if (inst == null) cli.close(); //that instance does not exist

						cli.inst = instR;
						instR.addClient(cli);
					}
				} catch (err) {
					console.log(err);
					cli.close(); //just leave
				}
			}
		} else {
			cli.inst.handleMessage(cli, data, flags);
		}
	});

	cli.on('close', function() {
		if (cli.inst != null) {
			cli.inst.removeClient(cli);
		}
	})

	cli.on('error', function() {
		if (cli.inst != null) {
			cli.inst.removeClient(cli);
		}
		console.log("WARNING: websockets error, disconnecting client")
		try { cli.close(); } catch (e) {}
	})

	//expose some helpful functions
	cli.trySendJ = function(p) {
		try {
			cli.send(JSON.stringify(p));
			return true;
		} catch (e) {
			return false;
		}
	}
})