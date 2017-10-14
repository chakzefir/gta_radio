function PositionHelper()
{

}

PositionHelper.prototype.init = function() {
    var stationsNodes = document.querySelectorAll('.station');
    var stationsQuantity = stationsNodes.length;
    var degree = 0;

    Array.prototype.forEach.call(stationsNodes, function(el, i) {
        degree += 360 / stationsQuantity;

        el.style.transform = 'rotate(-' + degree + 'deg)';

        el.querySelector('span').style.transform  = 'rotate(' + degree + 'deg)';
        el.querySelector('span').style.background = 'rgb(90, 10, ' + i + '0)';
    });

    // debugger
}