var AIwaypoints = [
	{ //0 - dummy so we can get 1 based
		p: [Infinity, Infinity],
		con: []
	},

	{ //1
		p: [172, 196],
		con: [
			{ type:"n", target:2 },
			{ type:"n", target:14 },
			{ type:"j", target:8 }
		]
	},

	{ //2
		p: [266, 245],
		con: [
			{ type:"n", target:1 },
			{ type:"n", target:3 }
		]
	},

	{ //3
		p: [392, 267],
		con: [
			{ type:"n", target:2 },
			{ type:"j", target:10 },
			{ type:"n", target:4 }
		]
	},

	{ //4
		p: [650, 278],
		con: [
			{ type:"n", target:3 },
			{ type:"n", target:5 }
		]
	},

	{ //5
		p: [908, 267],
		con: [
			{ type:"n", target:4 },
			{ type:"j", target:11 },
			{ type:"n", target:6 }
		]
	},

	{ //6
		p: [1034, 245],
		con: [
			{ type:"n", target:5 },
			{ type:"n", target:7 }
		]
	},

	{ //7
		p: [1128, 196],
		con: [
			{ type:"n", target:6 },
			{ type:"n", target:24 },
			{ type:"j", target:13 }
		]
	},

	{ //8
		p: [305, 103],
		con: [
			{ type:"n", target:1 },
			{ type:"n", target:9 }
		]
	},

	{ //9
		p: [363, 103],
		con: [
			{ type:"n", target:8 },
			{ type:"n", target:3 },
			{ type:"j", target:10 }
		]
	},

	{ //10
		p: [515, 148],
		con: [
			{ type:"n", target:3 },
			{ type:"n", target:11 },
			{ type:"j", target:9 }
		]
	},

	{ //11
		p: [790, 148],
		con: [
			{ type:"n", target:10 },
			{ type:"n", target:5 },
			{ type:"j", target:12 }
		]
	},

	{ //12
		p: [941, 103],
		con: [
			{ type:"n", target:13 },
			{ type:"n", target:5 },
			{ type:"j", target:11 }
		]
	},

	{ //13
		p: [1000, 103],
		con: [
			{ type:"n", target:12 },
			{ type:"n", target:7 },
		]
	},

	{ //14
		p: [58, 543],
		con: [
			{ type:"n", target:15 }
		]
	},

	{ //15
		p: [173, 543],
		con: [
			{ type:"n", target:14 },
			{ type:"n", target:16 },
			{ type:"w", target:1, dir:-1 },
		]
	},

	{ //16
		p: [465, 414],
		con: [
			{ type:"n", target:15 },	
			{ type:"n", target:27 },
		]
	},

	{ //17
		p: [710, 383],
		con: [
			{ type:"n", target:18 },
		]
	},

	{ //18
		p: [761, 383],
		con: [
			{ type:"n", target:17 },
			{ type:"n", target:19 },
		]
	},

	{ //19
		p: [880, 502],
		con: [
			{ type:"n", target:35 },
			{ type:"j", target:18 },
			{ type:"n", target:20 },
		]
	},

	{ //20
		p: [937, 502],
		con: [
			{ type:"n", target:19 },
			{ type:"n", target:28 },
			{ type:"j", target:21 },
			{ type:"j", target:23, dir:1 },
		]
	},

	{ //21
		p: [1046, 502],
		con: [
			{ type:"n", target:28 },
			{ type:"n", target:22 },
			{ type:"j", target:20 },
			{ type:"j", target:23 }
		]
	},

	{ //22
		p: [1219, 502],
		con: [
			{ type:"n", target:21 },
		]
	},

	{ //23
		p: [1175, 396],
		con: [
			{ type:"n", target:21 },
			{ type:"n", target:24 },
		]
	},

	{ //24
		p: [1218, 396],
		con: [
			{ type:"n", target:23 },
			{ type:"w", target:7, dir:1 },
		]
	},

	{ //25
		p: [217, 714],
		con: [
			{ type:"n", target:26 }
		]
	},

	{ //26
		p: [465, 589],
		con: [
			{ type:"n", target:25 },
			{ type:"w", target:16, dir:1, allowance:5 },
			{ type:"n", target:27 },
		]	
	},

	{ //27
		p: [590, 687],
		con: [
			{ type:"n", target:31 },
			{ type:"n", target:35 },
			{ type:"j", target:26 },
			{ type:"w", target:19, dir:1, sameSide:-1},
		]	
	},

	{ //28
		p: [988, 665],
		con: [
			{ type:"n", target:29 },
			{ type:"w", target:20, dir:1, allowance:1},
		]
	},

	{ //29
		p: [1153, 671],
		con: [
			{ type:"n", target:28 },
			{ type:"n", target:39 },
		]
	},

	{ //30
		p: [249, 888],
		con: [
			{ type:"w", target:25, dir:-1 },
			{ type:"n", target:31 },
		]
	},

	{ //31
		p: [385, 922],
		con: [
			{ type:"n", target:30 },
			{ type:"j", target:32 },
		]
	},

	{ //32
		p: [585, 827],
		con: [
			{ type:"n", target:31 },
			{ type:"n", target:37 },
		]
	},

	{ //33
		p: [585, 888],
		con: [
			{ type:"n", target:31 },
			{ type:"n", target:37 },
			{ type:"j", target:34 }
		]
	},

	{ //34
		p: [697, 786],
		con: [
			{ type:"n", target:33 },
			{ type:"n", target:35 },
		]
	},

	{ //35
		p: [723, 786],
		con: [
			{ type:"n", target:34 },
			{ type:"j", target:27 },
			{ type:"n", target:36 },
		]
	},

	{ //36
		p: [749, 786],
		con: [
			{ type:"n", target:35 },
			{ type:"n", target:38 },
		]
	},

	{ //37
		p: [761, 921],
		con: [
			{ type:"j", target:33 },
			{ type:"j", target:32, dir:-1},
			{ type:"n", target:38 },
		]
	},

	{ //38
		p: [935, 896],
		con: [
			{ type:"n", target:37 },
			{ type:"n", target:39 },
			{ type:"j", target:36 },
		]
	},

	{ //39
		p: [1206, 792],
		con: [
			{ type:"n", target:38 },
			{ type:"w", target:29, dir:1, allowance:0.5},
		]
	},
]

for (var i=0; i<AIwaypoints.length; i++) {
	AIwaypoints[i].i = i;
}