var model = {
	getData: new Promise(function (resolve, reject) {
		var request = new XMLHttpRequest();
		request.open('GET', '/tracklist.json', true);

		request.onload = function() {
		  if (request.status >= 200 && request.status < 400) {
		    resolve(JSON.parse(this.response));
		  } else {
		    model.requestError(this.statusText);
		  }
		};
		request.send();
	}),
	requestError: function (errorText) {
		throw new Error(errorText);
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
			currentStation.el.className = 'station';
			currentStation.el.appendChild(currentStation.content);
			currentStation.el.setAttribute('data-id', station);
			interface.appendChild(currentStation.el);
		}
	}
};

var controller = {
	init: function () {
		var stationsNodeList = document.querySelectorAll('.station');

		for(var i = 0; i < stationsNodeList.length; i++) {
			stationsNodeList[i].addEventListener('click', function() {
				playerController.playStation(this.getAttribute('data-id'));
			});
		}
	}
}

var stationsList;

model.getData.then(function(result){
	stationsList = result.stations;
	view.init(stationsList);
	controller.init();
});

var playerController = {
	player: '',
	currentStation: {},
	init: function() {
		this.player = new YT.Player('player', {
			height: '390',
	        width: '640',
	        videoId: playerController.getRandomTrackSrc(),
	        playerVars: {
				autoplay: 1
			},
	    })
    },
    getRandomStation: function() {
		var randomStation = Math.floor(Math.random() * stationsList.length);
    	return stationsList[randomStation];
    },
    getStationById: function(stationId) {
		return stationsList[stationId];
    },
    getRandomTrackSrc: function(station) {
    	if(!station) {
    		station = this.currentStation = this.getRandomStation();
    	}
    	var randomTrack = Math.floor(Math.random() * station.tracks.length);
    	return station.tracks[randomTrack].src;
    },
    playStation: function(station) {
    	if (typeof(station) === 'object') {
			this.currentStation = station;
    	} else if (typeof(station) === 'string' || typeof(station) === 'number') {
    		this.currentStation = this.getStationById(station);
    	} else {
    		throw new Error('Invalid type of station');
    	}
    	this.player.loadVideoById(this.getRandomTrackSrc(this.currentStation));
    	//TODO: write error catcher for broken tracks without 'src' param
    },
	playNextTrack: function() {
		this.playStation(this.currentStation);
	},
    playerStateHandler: function(status) {
    	switch(status.data) {
    		case 0:
				playerController.playStation(playerController.currentStation)
				break;
    	}
    	console.log('Video status: ' + status.data);
    },
    playerErrorHandler: function() {
    	playerController.playNextTrack();
    }
};

function onYouTubeIframeAPIReady() {
	playerController.init();
	playerController.player.addEventListener('onStateChange', playerController.playerStateHandler);
	playerController.player.addEventListener('onError', playerController.playerErrorHandler);
};