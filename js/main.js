// Add Base Layer
var mapquestUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png';
var subDomains = ['otile1','otile2','otile3','otile4'];
var osmAttrib='Map: <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png"> and <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>';
var mapquest = L.tileLayer(mapquestUrl, {minZoom: 14, maxZoom: 18, 
            attribution: osmAttrib, subdomains: ["otile1", "otile2", "otile3", "otile4"]})

var map = L.map('map', { zoomControl:false, maxBounds: [[7,-73.9],[7.1,-73.8]]});
map.setView([7.061, -73.859], 15);
map.attributionControl.setPrefix('<a href="http://www.makina-corpus.com/" target="_blank">Makina Corpus</a>');

var baseMaps = {
    "mapquest": mapquest
};

mapquest.addTo(map);

$("input[name='basemapLayers']").change(function () {
    // Remove unchecked layers
    $("input:radio[name='basemapLayers']:not(:checked)").each(function () {
        map.removeLayer(window[$(this).attr("id")]);
    });
    // Add checked layer
    $("input:radio[name='basemapLayers']:checked").each(function () {
        map.addLayer(window[$(this).attr("id")]);
    });
});

// Create markers

var attractionsMarker = L.icon({
    iconUrl: 'img/marker-attractions.png',
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [35, 45], 
    iconAnchor:   [17, 42],
    popupAnchor: [1, -32],
    shadowAnchor: [10, 12],
    shadowSize: [36, 16]
});
var hotelsMarker = L.icon({
    iconUrl: 'img/marker-hotels.png',
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [35, 45], 
    iconAnchor:   [17, 42],
    popupAnchor: [1, -32],
    shadowAnchor: [10, 12],
    shadowSize: [36, 16]
});
var transportMarker = L.icon({
    iconUrl: 'img/marker-transport.png',
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [35, 45], 
    iconAnchor:   [17, 42],
    popupAnchor: [1, -32],
    shadowAnchor: [10, 12],
    shadowSize: [36, 16]
});

// Add geojson layers

var attractions = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: attractionsMarker,
            title: feature.properties.name,
            riseOnHover: true
        });
    },
    onEachFeature: function (feature, layer) {
        if (feature.properties) {
            var content =   "<h4>" + feature.properties.name + "</h4>";
            layer.bindPopup(content, {
                maxWidth: "auto",
                closeButton: false
            });
        }
    }
});
$.getJSON("data/attractions.geojson", function (data) {
    attractions.addData(data);
});

var hotels = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: hotelsMarker,
            title: feature.properties.name,
            riseOnHover: true
        });
    },
    onEachFeature: function (feature, layer) {
        if (feature.properties) {
            var content =   "<h4>" + feature.properties.name + "</h4>";
            layer.bindPopup(content, {
                maxWidth: "auto",
                closeButton: false
            });
        }
    }
});
$.getJSON("data/hotels.geojson", function (data) {
    hotels.addData(data);
});

var transport = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: transportMarker,
            title: feature.properties.name,
            riseOnHover: true
        });
    },
    onEachFeature: function (feature, layer) {
        if (feature.properties) {
            var content =   "<h4>" + feature.properties.name + "</h4>";
            layer.bindPopup(content, {
                maxWidth: "auto",
                closeButton: false
            });
        }
    }
});
$.getJSON("data/transport.geojson", function (data) {
    transport.addData(data);
});

$("input:checkbox[name='overlayLayers']").change(function () {
    var layers = [];
    if ($("#" + $(this).attr("id")).is(":checked")) {
        $("input:checkbox[name='overlayLayers']").each(function () {
            // Remove all overlay layers
            map.removeLayer(window[$(this).attr("id")]);
            if ($("#" + $(this).attr("id")).is(":checked")) {
                // Add checked layers to array for sorting
                layers.push({
                    "layer": $(this)
                });
            }
        });
        $.each(layers, function () {
            map.addLayer(window[$(this)[0].layer[0].id]);
        });
    } else {
        // Simply remove unchecked layers
        map.removeLayer(window[$(this).attr("id")]);
    }
});

map.addLayer(attractions);