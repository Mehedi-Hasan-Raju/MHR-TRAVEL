   
		mapboxgl.accessToken = mapToken;
        //console.log(mapToken);
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/outdoors-v12', // container ID
        center: Listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });

    //console.log(coordinates);
    const marker1 = new mapboxgl.Marker({color: "red"})
        .setLngLat(Listing.geometry.coordinates)
         .setPopup(new mapboxgl.Popup({offset: 25})
        
         .setHTML
         (`<h4>${Listing.title}</h4><p>Exact location will be provided after booking</p>`))
        .addTo(map);
        map.addControl(new mapboxgl.FullscreenControl());
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.ScaleControl());
map.zoomTo(14, {
    duration: 8000,
    offset: [0, 0],
  });