export default () => {
    const stationsNodes = document.querySelectorAll('.station');
    const stationsQuantity = stationsNodes.length;
    let degree = 0;

    Array.prototype.forEach.call(stationsNodes, function(el, i) {
        let spanNode = el.querySelector('span');
        degree += 360 / stationsQuantity;

        el.style.transform = 'rotate(-' + degree + 'deg)';

        spanNode.style.transform = 'rotate(' + degree + 'deg)';
        // spanNode.style.background = 'rgb(90, 10, ' + i + '0)';
        spanNode.style.backgroundImage = 'url("./station-logos/' + el.querySelector('span').innerText + '.jpg")';
    });
}