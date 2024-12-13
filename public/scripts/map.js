ymaps.ready(init);
function init() {
    var myMap = new ymaps.Map("map", {
        center: [55.751574, 37.573856],
        zoom: 9
    });

    var myPlacemark = new ymaps.Placemark([55.751574, 37.573856], {
        hintContent: 'Esports Club',
        balloonContent: 'Москва, Профсоюзная, 56'
    });

    myMap.geoObjects.add(myPlacemark);
}
