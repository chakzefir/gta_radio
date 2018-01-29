// var model = {
// 	getData: new Promise(function (resolve, reject) {
// 		var request = new XMLHttpRequest();
// 		request.open('GET', '/tracklist.json', true);

// 		request.onload = function() {
// 		  if (request.status >= 200 && request.status < 400) {
// 		    resolve(JSON.parse(this.response));
// 		  } else {
// 		    model.throwError(this.statusText);
// 		  }
// 		};
// 		request.send();
// 	}),
// 	throwError: function (errorText) {
// 		throw new Error(errorText);
// 	    document.writeln('Player is broken please connect <a href="mailto:4uk93@mail.ru">chakzefir</a>')
// 	}
// };

var development = true;

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
			currentStation.el.setAttribute('data-id', stations[station].id);
			interface.appendChild(currentStation.el);
		}

        positionHelper.init();
	},
	displayTrackInfo: function(stationName, artistName, trackName) {
		this.nodes.stationNameContainer.innerText = stationName;
		this.nodes.artistNameContainer.innerText = artistName;
		this.nodes.trackNameContainer.innerText = trackName;
	},
    activeStation: function(stationId) {
        if(document.querySelector('.station.active')) {
            document.querySelector('.station.active').classList.remove('active');
        }
        document.querySelector('.station[data-id="' + stationId + '"]').classList.add('active');
    }
};

var controller = {
	init: function () {
		var stationsNodeList = document.querySelectorAll('.station > span');

		for(var i = 0; i < stationsNodeList.length; i++) {
			stationsNodeList[i].addEventListener('click', function() {
				playerController.playStation(this.parentElement.getAttribute('data-id'));
			});
		}
	}
}


var	playerStateHandler = function(status) {
	// console.info('Video status: ' + status.data);
	switch(status.data) {
		case 0:
			playerController.playStation(playerController.currentStation)
			break;
        case 1:
            tuningController.pause();
            console.info('track is playing');
            break;
        case 2:
            console.info('track stopped');
            break;
        case 3:
            tuningController.play();
            console.info('track is loading');
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
		if(development) {
            tuningController.pause();
        } else {
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
        }
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
    		// console.warn('track is repeated');
    		this.getRandomTrackSrc(station);
    	} else if (station.tracks[randomTrackId].src.length < 10) {
    		// console.warn('track src is null');
    		this.getRandomTrackSrc(station)
    	} else {
    		this.previousTrackId = randomTrackId;
    		view.displayTrackInfo(station.name, station.tracks[randomTrackId].artist, station.tracks[randomTrackId].title);
			return station.tracks[randomTrackId].src;
    	}
    },
    playStation: function(station) {
        var stationId;
        var trackId;

    	if (typeof(station) === 'object') {
			this.currentStation = station;
            stationId = station.id;
    	} else if (typeof(station) === 'string' || typeof(station) === 'number') {
    		this.currentStation = this.getStationById(station);
            stationId = station;
    	} else {
    		throw new Error('Invalid type of station');
    	}
        view.activeStation(stationId);
        trackId = this.getRandomTrackSrc(this.currentStation);
        console.info(stationId + '/' + trackId);
    	return this.player.loadVideoById(trackId, 0, this.prefferableQuality);
    },
    pleasePlay: function() {
    	var self = this;
    	self.player.playVideo();
    }
};

var tuningController = {
    tuningNode: document.querySelector('#tuning'),
    play: function() {
        this.tuningNode.play();
    },
    pause: function() {
        this.tuningNode.pause();
    }
};

var stationsList;

function onYouTubeIframeAPIReady() {
	// model.getData.then(function(result){
		// stationsList = result.stations;
        stationsList = tracklist.stations;
		view.init(stationsList);
		controller.init();

		playerController.init();
	// });
};
