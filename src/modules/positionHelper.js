function PositionHelper()
{

}

PositionHelper.prototype.init = function() {
    var stationsNodes = document.querySelectorAll('.station');
    var stationsQuantity = stationsNodes.length;
    var degree = 0;
    var spanNode;

    Array.prototype.forEach.call(stationsNodes, function(el, i) {
        degree += 360 / stationsQuantity;
        spanNode = el.querySelector('span');

        el.style.transform = 'rotate(-' + degree + 'deg)';

        spanNode.style.transform = 'rotate(' + degree + 'deg)';
        // spanNode.style.background = 'rgb(90, 10, ' + i + '0)';
        spanNode.style.backgroundImage = 'url("./station-logos/' + el.querySelector('span').innerText + '.jpg")';
    });
}