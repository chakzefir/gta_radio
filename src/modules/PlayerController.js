import tuningController from "TuningController";

class PlayerController {
    player: '',
    prefferableQuality: 'small',
    previousTrackId: 0,
    currentStation: {},

    constructuctor() {
        if(window.App.debug) {
            tuningController.pause();
        } else {
            this.player = new YT.Player('player', {
                events: {
                    'onReady': () => {
                        player_controller.currentStation = player_controller.getRandomStation();
                        player_controller.playStation(player_controller.currentStation);
                    },
                    'onStateChange': playerStateHandler,
                    'onError': this.onError,
                },
            });
        }
    },
    getRandomStation() {
        var randomStation = Math.floor(Math.random() * stationsList.length);
        return stationsList[randomStation];
    },
    getStationById(stationId) {
        return stationsList[stationId];
    },
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
            view.displayTrackInfo(station.name, station.tracks[randomTrackId].artist, station.tracks[randomTrackId].title);
            return station.tracks[randomTrackId].src;
        }
    },
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
        view.activeStation(stationId);
        trackId = this.getRandomTrackSrc(this.currentStation);
        console.info(stationId + '/' + trackId);
        return this.player.loadVideoById(trackId, 0, this.prefferableQuality);
    },
    pleasePlay() {
        this.player.playVideo()
    },
    playerStateHandler = function(status) {
    // console.info('Video status: ' + status.data);
    switch(status.data) {
        case 0:
            this.playStation(this.currentStation)
            break;
        case 1:
            tuningController.pause()
            console.info('track is playing')
            break
        case 2:
            console.info('track stopped')
            break
        case 3:
            tuningController.play()
            console.info('track is loading')
            break
    },
    onError() {
        this.playStation(this.currentStation);
    }
}