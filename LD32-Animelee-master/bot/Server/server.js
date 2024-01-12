//
// LD32 Dedicated server main file.
//

// Default config:
var defaultCfg = {
	port:8081,
}
// --

process.title = "LD32 Dedicated Server";

console.log("Initializing server...");
try {
	var ws		= require('ws'),
  	http		= require('http'),
  	fs			= require('fs'),
  	inst 		= require('./modules/ld32Instance.js');

  	//host game locally
  	var connect = require('connect');
	var serveStatic = require('serve-static');
	connect().use(serveStatic("../")).listen(81);
} catch (err) {
	console.error("FATAL ERROR - could not load modules. Ensure you have ws for websockets.");
	process.exit(1);
}
console.log("Modules Ready!");

try {
	var config = JSON.parse(fs.readFileSync('config.json', 'ascii'));
} catch (err) {
	if (err.errno == 34) {
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
instances.push(new inst.ld32Instance(config, wss));

wss.on('connection', function(cli) {
	//client needs to connect to an instance before anything.

	cli.on('message', function(data, flags) {
		cli.lastMessage = Date.now();
		if (cli.inst == null) {
			if (flags.binary) cli.close(); //first packet must identify location.
			else {
				try {
					var obj = JSON.parse(data);
					if (obj.t == "*") {
						cli.credentials = obj.c;
						var inst = instances[obj.i];
						if (inst == null) cli.close(); //that instance does not exist
						else {
							cli.inst = inst;
							inst.addClient(cli);
						}
					}
				} catch (err) {
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
		console.log("client ERROR! (oh NO!)")
		try { cli.close(); } catch (e) {}
	})
})