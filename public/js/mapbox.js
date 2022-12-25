/* eslint-disable */

export const displayMap = locations => {
    mapboxgl.accessToken =
        'pk.eyJ1IjoicG9waWFuZyIsImEiOiJjbGMyMjBtbngzbG9sM25xbnZyeHduamJ3In0.yNlj-XV06jZlyZAKWMlwgg';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/popiang/clc23bl5n000215pckqio1r0w',
        scrollZoom: false
        // center: [-118.113491, 34.111745],
        // zoom: 10,
        // interactive: false
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        // create marker
        const el = document.createElement('div');
        el.className = 'marker';

        // add marker
        new mapboxgl.Marker({
            element: el,
            achor: 'bottom'
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        // add popup
        new mapboxgl.Popup({
            offset: 30
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        // extends map bounds to include the current location
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
};
