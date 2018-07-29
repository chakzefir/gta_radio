class TuningController {
	tuningNode: document.querySelector('#tuning'),
	static  play() {
        this.tuningNode.play();
    },
    static pause() {
        this.tuningNode.pause();
    }
}