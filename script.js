var controller = {
	getData: new Promise(function (resolve, reject) {
		var request = new XMLHttpRequest();
		request.open('GET', '/tracklist.json', true);

		request.onload = function() {
		  if (request.status >= 200 && request.status < 400) {
		    resolve(JSON.parse(this.response));
		  } else {
		    controller.requestError(this.statusText);
		  }
		};
		request.send();
	}),
	requestError: function (errorText) {
		console.warn(errorText);
	    document.writeln('Player is broken please connect <a href="mailto:4uk93@mail.ru">chakzefir</a>')
	}
};

var view = {
	init: function (stations) {
		var interface = document.querySelector('#interface');

		for (var station in stations) {
			currentStation = {
				el: document.createElement("p"),
				content: document.createTextNode(stations[station].name)
			};
			currentStation.el.appendChild(currentStation.content)
			interface.appendChild(currentStation.el);
		}
	}
};

var stationsList;

controller.getData.then(function(result){
	stationsList = result.stations;
	// view.init(stationsList)
});

var playerController = {
	player: '',
	init: function() {
		this.player = new YT.Player('player', {
			height: '390',
	        width: '640',
	        videoId: playerController.getRandomTrack()
	    })
    },
    getRandomTrack: function() {
    	var randomStation = Math.floor(Math.random() * stationsList.length);
    	console.info(randomStation);
    	console.log('Random station: ' + stationsList[randomStation].name);
    	var randomTrack = Math.floor(Math.random() * stationsList[randomStation].tracks.length);
    	console.info(randomTrack);
    	console.log('Random track: ' + stationsList[randomStation].tracks[randomTrack].artist + ' - ' + stationsList[randomStation].tracks[randomTrack].title);
    	return stationsList[randomStation].tracks[randomTrack].src;
    }

};

function onYouTubeIframeAPIReady() {
	playerController.init();
};