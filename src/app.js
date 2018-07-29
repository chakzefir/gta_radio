import PlayerController from "./modules/PlayerController.js";
import tracklist from "./modules/data/tracklist.js";

class App {
    constructor() {
        this.debug = false
    }
    init() {
        console.info('App start')

        this.playerController = new PlayerController(tracklist.stations);
    }
}

window.App = new App()