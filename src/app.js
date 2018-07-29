window.App.debug = true;

class Controller {
    init: function() {
        const stationsNodeList = document.querySelectorAll('.station > span');

        for(var i = 0; i < stationsNodeList.length; i++) {
            stationsNodeList[i].addEventListener('click', function() {
                playerController.playStation(this.parentElement.getAttribute('data-id'));
            });
        }
    }
}





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
