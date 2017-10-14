var model = {
	getData: new Promise(function (resolve, reject) {
		var request = new XMLHttpRequest();
		request.open('GET', '/tracklist.json', true);

		request.onload = function() {
		  if (request.status >= 200 && request.status < 400) {
		    resolve(JSON.parse(this.response));
		  } else {
		    model.throwError(this.statusText);
		  }
		};
		request.send();
	}),
	throwError: function (errorText) {
		throw new Error(errorText);
	    document.writeln('Player is broken please connect <a href="mailto:4uk93@mail.ru">chakzefir</a>')
	}
};

var view = {
	nodes: {
		'stationNameContainer': document.querySelector('.station-name'),
		'artistNameContainer': document.querySelector('.artist-name'),
		'trackNameContainer': document.querySelector('.track-name'),
	},
	init: function (stations) {
		var interface = document.querySelector('#interface');
        var positionHelper = new PositionHelper();

		for (var station in stations) {
			currentStation = {
				el: document.createElement("div"),
                html: "<span>" + stations[station].name + "</span>",
			};
			currentStation.el.className = 'station';
            currentStation.el.innerHTML = currentStation.html;
			currentStation.el.setAttribute('data-id', station);
			interface.appendChild(currentStation.el);
		}

        positionHelper.init();
	},
	displayTrackInfo: function(stationName, artistName, trackName) {
		this.nodes.stationNameContainer.innerText = stationName;
		this.nodes.artistNameContainer.innerText = artistName;
		this.nodes.trackNameContainer.innerText = trackName;
	},
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


var	playerStateHandler = function(status) {
	console.log('Video status: ' + status.data);
	switch(status.data) {
		case 0:
			playerController.playStation(playerController.currentStation)
			break;
	}
};

var playerErrorHandler = function() {
	playerController.playStation(playerController.currentStation);
};

var playerController = {
	player: '',
	prefferableQuality: 'small',
	previousTrackId: 0,
	currentStation: {},
	init: function() {
		player_controller = this;
		this.player = new YT.Player('player', {
			events: {
				'onReady': function(){
				    player_controller.currentStation = player_controller.getRandomStation();
				    player_controller.playStation(player_controller.currentStation);
				},
				'onStateChange': playerStateHandler,
				'onError': playerErrorHandler,
			},
	    });
    },
    getRandomStation: function() {
		var randomStation = Math.floor(Math.random() * stationsList.length);
    	return stationsList[randomStation];
    },
    getStationById: function(stationId) {
		return stationsList[stationId];
    },
    getRandomTrackSrc: function(station) {
    	var randomTrackId = Math.floor(Math.random() * station.tracks.length);

    	//Check to avoid track repeat and null src tracks
    	if (randomTrackId === this.previousTrackId) {
    		// console.info('track is repeated');
    		this.getRandomTrackSrc(station);
    	} else if (station.tracks[randomTrackId].src.length < 10) {
    		// console.info('track src is null');
    		this.getRandomTrackSrc(station)
    	} else {
    		this.previousTrackId = randomTrackId;
    		view.displayTrackInfo(station.name, station.tracks[randomTrackId].artist, station.tracks[randomTrackId].title);
			return station.tracks[randomTrackId].src;
    	}
    },
    playStation: function(station) {
    	if (typeof(station) === 'object') {
			this.currentStation = station;
    	} else if (typeof(station) === 'string' || typeof(station) === 'number') {
    		this.currentStation = this.getStationById(station);
    	} else {
    		throw new Error('Invalid type of station');
    	}
    	return this.player.loadVideoById(this.getRandomTrackSrc(this.currentStation), 0, this.prefferableQuality);
    },
    pleasePlay: function() {
    	var self = this;
    	self.player.playVideo();
    }
};

var stationsList;

function onYouTubeIframeAPIReady() {
	model.getData.then(function(result){
		stationsList = result.stations;
		view.init(stationsList);
		controller.init();

		playerController.init();
	});
};