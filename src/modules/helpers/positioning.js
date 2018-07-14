export default function() {
    const stationsNodes = document.querySelectorAll('.station');
    const stationsQuantity = stationsNodes.length;

    Array.prototype.forEach.call(stationsNodes, function(el, i) {
        let degree += 360 / stationsQuantity;
        let spanNode = el.querySelector('span');

        el.style.transform = 'rotate(-' + degree + 'deg)';

        spanNode.style.transform = 'rotate(' + degree + 'deg)';
        // spanNode.style.background = 'rgb(90, 10, ' + i + '0)';
        spanNode.style.backgroundImage = 'url("./station-logos/' + el.querySelector('span').innerText + '.jpg")';
    });
}