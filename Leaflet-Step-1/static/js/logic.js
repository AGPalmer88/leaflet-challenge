// Function to determine marker size based on population
function markerSize(mag) {
  return mag;
}
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
// Once we get a response, send the data.features object to the createFeatures function
createFeatures(data.features);
});
function createFeatures(earthquakeData) {
// Define a function we want to run once for each feature in the features array
// Give each feature a popup describing the place and time of the earthquake
function onEachFeature(feature, layer) {
  layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>");
}
// Create a GeoJSON layer containing the features array on the earthquakeData object
// Run the onEachFeature function once for each piece of data in the array
var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {
          radius: feature.properties.mag,
        });
      },
  onEachFeature: onEachFeature
});
function getColor(d) {
  if (d > 6)
      return '#800026';
  if (d > 5)
      return '#BD0026';
  if (d > 4)
      return '#E31A1C';
  if (d > 3)
      return '#FC4E2A';
  if (d > 2)
      return '#FD8D3C';
  if (d > 1)
      return '#FEB24C';
  if (d  > 0)
    return "#FED976";
}
var earthquakes = L.geoJSON(earthquakeData, {

        style: function (feature) {
            return feature.properties && feature.properties.style;
        },

        onEachFeature: onEachFeature,

        pointToLayer: function (feature, latlng) {

    console.log(getColor(feature.properties.mag));
      return new L.circleMarker(latlng, {
              radius: feature.properties.mag *6,
                fillColor: getColor(feature.properties.mag),
        color: getColor(feature.properties.mag),
        weight: 1,
                opacity: 1,
                fillOpacity: 0.8

            });
        }
    })
// Sending our earthquakes layer to the createMap function
createMap(earthquakes);
}
function createMap(earthquakes) {
// Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});
var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});
// Define a baseMaps object to hold our base layers
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap
};
// Create overlay object to hold our overlay layer
var overlayMaps = {
  Earthquakes: earthquakes
};
// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
  layers: [streetmap, earthquakes]
});
// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);
function getColor(d) {
  if (d > 6)
      return '#800026';
  if (d > 5)
      return '#BD0026';
  if (d > 4)
      return '#E31A1C';
  if (d > 3)
      return '#FC4E2A';
  if (d > 2)
      return '#FD8D3C';
  if (d > 1)
      return '#FEB24C';
  if (d  > 0)
    return "#FED976";
}
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (myMap) {
  var div = L.DomUtil.create('div', 'info legend'),
      quakes = [0, 1, 2, 3, 4, 5, 6],
      labels = [];
  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < quakes.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(quakes[i] + 1) + '"></i> ' +
          quakes[i] + (quakes[i + 1] ? '&ndash;' + quakes[i + 1] + '<br>' : '+');
  }
  return div;
};
legend.addTo(myMap);
}