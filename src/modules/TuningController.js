class TuningController {
	constructor() {
		this.tuningNode = document.querySelector('#tuning')
	}
	play() {
        this.tuningNode.play();
    }
    pause() {
        this.tuningNode.pause();
    }
}

export default TuningController