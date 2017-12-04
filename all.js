'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _randomizer = require('./modules/randomizer.js');

var _randomizer2 = _interopRequireDefault(_randomizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _randomizer2.default)();

var debug = true;

var view = {
    nodes: {
        'stationNameContainer': document.querySelector('.station-name'),
        'artistNameContainer': document.querySelector('.artist-name'),
        'trackNameContainer': document.querySelector('.track-name')
    },
    init: function init(stations) {
        var appInterface = document.querySelector('#interface');
        var positionHelper = new PositionHelper();
        var currentStation;

        for (var station in stations) {
            currentStation = {
                el: document.createElement("div"),
                html: "<span>" + stations[station].name + "</span>"
            };
            currentStation.el.className = 'station';
            currentStation.el.innerHTML = currentStation.html;
            currentStation.el.setAttribute('data-id', stations[station].id);
            appInterface.appendChild(currentStation.el);
        }

        positionHelper.init();
    },
    displayTrackInfo: function displayTrackInfo(stationName, artistName, trackName) {
        this.nodes.stationNameContainer.innerText = stationName;
        this.nodes.artistNameContainer.innerText = artistName;
        this.nodes.trackNameContainer.innerText = trackName;
    },
    activeStation: function activeStation(stationId) {
        if (document.querySelector('.station.active')) {
            document.querySelector('.station.active').classList.remove('active');
        }
        document.querySelector('.station[data-id="' + stationId + '"]').classList.add('active');
    }
};

var controller = {
    init: function init() {
        var stationsNodeList = document.querySelectorAll('.station > span');

        for (var i = 0; i < stationsNodeList.length; i++) {
            stationsNodeList[i].addEventListener('click', function () {
                playerController.playStation(this.parentElement.getAttribute('data-id'));
            });
        }
    }
};

var playerStateHandler = function playerStateHandler(status) {
    // console.info('Video status: ' + status.data);
    switch (status.data) {
        case 0:
            playerController.playStation(playerController.currentStation);
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

var playerErrorHandler = function playerErrorHandler() {
    playerController.playStation(playerController.currentStation);
};

var playerController = {
    player: '',
    prefferableQuality: 'small',
    previousTrackId: 0,
    currentStation: {},
    init: function init() {
        var player_controller = this;
        if (debug) {
            tuningController.pause();
        } else {
            this.player = new YT.Player('player', {
                events: {
                    'onReady': function onReady() {
                        player_controller.currentStation = player_controller.getRandomStation();
                        player_controller.playStation(player_controller.currentStation);
                    },
                    'onStateChange': playerStateHandler,
                    'onError': playerErrorHandler
                }
            });
        }
    },
    getRandomStation: function getRandomStation() {
        var randomStation = Math.floor(Math.random() * stationsList.length);
        return stationsList[randomStation];
    },
    getStationById: function getStationById(stationId) {
        return stationsList[stationId];
    },
    getRandomTrackSrc: function getRandomTrackSrc(station) {
        var randomTrackId = Math.floor(Math.random() * station.tracks.length);

        //Check to avoid track repeat and null src tracks
        if (randomTrackId === this.previousTrackId) {
            // console.warn('track is repeated');
            this.getRandomTrackSrc(station);
        } else if (station.tracks[randomTrackId].src.length < 10) {
            // console.warn('track src is null');
            this.getRandomTrackSrc(station);
        } else {
            this.previousTrackId = randomTrackId;
            view.displayTrackInfo(station.name, station.tracks[randomTrackId].artist, station.tracks[randomTrackId].title);
            return station.tracks[randomTrackId].src;
        }
    },
    playStation: function playStation(station) {
        var stationId;
        var trackId;

        if ((typeof station === 'undefined' ? 'undefined' : _typeof(station)) === 'object') {
            this.currentStation = station;
            stationId = station.id;
        } else if (typeof station === 'string' || typeof station === 'number') {
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
    pleasePlay: function pleasePlay() {
        var self = this;
        self.player.playVideo();
    }
};

var tuningController = {
    tuningNode: document.querySelector('#tuning'),
    play: function play() {
        this.tuningNode.play();
    },
    pause: function pause() {
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
'use strict';

function PositionHelper() {}

PositionHelper.prototype.init = function () {
    var stationsNodes = document.querySelectorAll('.station');
    var stationsQuantity = stationsNodes.length;
    var degree = 0;
    var spanNode;

    Array.prototype.forEach.call(stationsNodes, function (el, i) {
        degree += 360 / stationsQuantity;
        spanNode = el.querySelector('span');

        el.style.transform = 'rotate(-' + degree + 'deg)';

        spanNode.style.transform = 'rotate(' + degree + 'deg)';
        // spanNode.style.background = 'rgb(90, 10, ' + i + '0)';
        spanNode.style.backgroundImage = 'url("./station-logos/' + el.querySelector('span').innerText + '.jpg")';
    });
};
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.randomizer = randomizer;
function randomizer() {
    var nos = [1, 2, 3, 4, 5, 6];
    console.log(nos);
}
//# sourceMappingURL=all.js.map
