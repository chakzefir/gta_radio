import TuningController from "./TuningController.js";
import View from "./View.js";

class PlayerController {
    constructor(stationsList) {
        this.player = ''
        this.prefferableQuality = 'small'
        this.previousTrackId = 0
        this.currentStation = {}
        this.stationsList = stationsList

        this.view = new View(stationsList);
        this.tuningController = new TuningController();
        this.bindEvents()

        if(window.App.debug) {
            this.tuningController.pause();
        } else {
            this.player = new YT.Player('player', {
                events: {
                    'onReady': () => {
                        this.currentStation = this.getRandomStation();
                        this.playStation(this.currentStation);
                    },
                    'onStateChange': this.playerStateHandler.bind(this),
                    'onError': this.onError.bind(this),
                },
            });
        }
    }
    getRandomStation() {
        var randomStation = Math.floor(Math.random() * this.stationsList.length);
        return this.stationsList[randomStation];
    }
    getStationById(stationId) {
        return this.stationsList[stationId];
    }
    getRandomTrackSrc(station) {
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
            this.view.displayTrackInfo(station.name, station.tracks[randomTrackId].artist, station.tracks[randomTrackId].title);
            return station.tracks[randomTrackId].src;
        }
    }
    playStation(station) {
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
        this.view.activeStation(stationId);
        trackId = this.getRandomTrackSrc(this.currentStation);
        console.info(stationId + '/' + trackId);
        return this.player.loadVideoById(trackId, 0, this.prefferableQuality);
    }
    pleasePlay() {
        this.player.playVideo()
    }
    playerStateHandler(status) {
        switch(status.data) {
            case 0:
                this.playStation(this.currentStation);
                break;
            case 1:
                this.tuningController.pause();
                console.info('track is playing');
                break;
            case 2:
                console.info('track stopped');
                break;
            case 3:
                this.tuningController.play()
                console.info('track is loading');
                break;
        }
    }
    onError() {
        this.playStation(this.currentStation);
    }
    bindEvents() {
        const stationsNodeList = document.querySelectorAll('.station > span');

        for(var i = 0; i < stationsNodeList.length; i++) {
            stationsNodeList[i].addEventListener('click', clickEvent => {
                this.playStation(clickEvent.target.parentElement.getAttribute('data-id'));
            });
        }
    }
}

export default PlayerController