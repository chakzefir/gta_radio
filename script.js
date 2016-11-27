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

var model = {
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

controller.getData.then(function(result){
	stationsList = result.stations;
	view.init(stationsList);
	model.init();
});

var playerController = {
	player: '',
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
    getRandomTrackSrc: function(stationObject) {
    	if(!stationObject) {
    		stationObject = this.getRandomStation();
    	}
    	var randomTrack = Math.floor(Math.random() * stationObject.tracks.length);
    	return stationObject.tracks[randomTrack].src;
    },
    playStation: function(station) {
    	var currentStation;
    	if (typeof(station) === 'object') {
			currentStation = station;
    	} else if (typeof(station) === 'string' || typeof(station) === 'number') {
    		currentStation = this.getStationById(station);
    	} else {
    		throw new Error('Invalid type of station');
    	}
    	this.player.loadVideoById(this.getRandomTrackSrc(currentStation));

    	//TODO: write error catcher for broken tracks without 'src' param
    }
};

function onYouTubeIframeAPIReady() {
	playerController.init();
};