//resources

function res(onload) {
	var t = this;

	t.img = [];
	t.snd = [];

	var imgSrc = [
		"bg.png",
		"select.png",

		"ico/body_slam.png",
		"ico/fire.png",
		"ico/poison_thorn.png",
		"ico/normalCD.png",
		"ico/ultCD.png",

		"ico/absorbfire.png",
		"ico/absorbpsn.png",
		"ico/burstgrow.png",
		"ico/defense.png",
		"ico/psn_shield.png",
		"ico/fire_shield.png",
		"ico/freeze.png",
		"ico/phys_shield.png",
		"ico/reflect.png",
		"ico/thorn.png",

		"flowers/des_normal.png",
		"flowers/inv_normal.png",
		"flowers/lvl_normal.png",
		"flowers/speed_normal.png",

		"ico/destructUlt.png",
		"ico/invulnUlt.png",
		"ico/levelUlt.png",
		"ico/growUlt.png",

		"sun.png",
		"sunflare.png",
		"sface/c1.png",
		"pick1over.png",
		"pick2over.png",
		"pickunder.png",
		"bud.png",
		"leaf.png",
		"budflip.png",
		"leafflip.png"
	];

	var sndSrc = [
		"big hit.wav",
		"change.wav",
		"select.wav",
		"small hit.wav",
		"music.ogg"
	];

	var totalFiles = imgSrc.length+sndSrc.length;
	var loadedFiles = 0;

	load()

	function load() {
		for (var i=0; i<imgSrc.length; i++) {
			loadImage(imgSrc[i]);
		}

		for (var i=0; i<sndSrc.length; i++) {
			loadSound("snd/"+sndSrc[i]);
		}
	}

	function loadSound(url, name) {
		var name = name;
		if (name == null) name = url; 
		var xml = new XMLHttpRequest();
		xml.open("GET", url, true);
		xml.responseType = "arraybuffer";

		xml.onload = function() {
			globalAudio.decodeAudioData(xml.response, function(buffer) {
				t.snd[name] = buffer;
				fileLoaded();
			}, function(){
				loadSound(url.substr(0, url.length-3)+"wav", url); //retry as wav
			});
		}
		xml.send();
	}

	function loadImage(src) {
		var img = new Image();
		img.src = "img/"+src;
		img.onload = function() {
			t.img[src] = img;
			fileLoaded();
		}
	}

	function fileLoaded() {
		if (++loadedFiles == totalFiles && onload != null) onload();
	}
}