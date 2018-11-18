import positionHelper from './helpers/positioning.js'

class View {
    constructor(stationsList) {
        const appInterface = document.querySelector('#interface');
        this.nodes = {
            'stationNameContainer': document.querySelector('.station-name'),
            'artistNameContainer': document.querySelector('.artist-name'),
            'trackNameContainer': document.querySelector('.track-name'),
            'body': document.querySelector('body')
        }

        for (let station in stationsList) {
            let currentStation = {
                el: document.createElement("div"),
                html: "<span>" + stationsList[station].name + "</span>",
            };
            currentStation.el.className = 'station';
            currentStation.el.innerHTML = currentStation.html;
            currentStation.el.setAttribute('data-id', stationsList[station].id);
            appInterface.appendChild(currentStation.el);
        }

        positionHelper()
    }
    displayTrackInfo(stationName, artistName, trackName) {
        this.nodes.stationNameContainer.innerText = stationName;
        this.nodes.artistNameContainer.innerText = artistName;
        this.nodes.trackNameContainer.innerText = trackName;
    }
    activeStation(stationId) {
        if(document.querySelector('.station.active')) {
            document.querySelector('.station.active').classList.remove('active');
        }
        document.querySelector('.station[data-id="' + stationId + '"]').classList.add('active');
    }
    activateApp() {
        this.nodes.body.classList.remove('deactivated');
    }
    deactivateApp() {
        this.nodes.body.classList.add('deactivated');
    }
}

export default View