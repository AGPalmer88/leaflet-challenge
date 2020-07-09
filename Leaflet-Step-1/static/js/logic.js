
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function markerSize(mag) {
    return mag * 40000;
}

function markerColor(mag) {
  if (mag <= 1) {
      return "#FD8D3C";
  } else if (mag <= 2) {
      return "#FC4E2A";
  } else if (mag <= 3) {
      return "#E31A1C";
  } else if (mag <= 4) {
      return "#BD0026";
  } else if (mag <= 5) {
      return "#800026";
  } else {
      return "#FEB24C";
  };
}
// function getColor(d) {
//     return d > 1000 ? '#800026' :
//            d > 500  ? '#BD0026' :
//            d > 200  ? '#E31A1C' :
//            d > 100  ? '#FC4E2A' :
//            d > 50   ? '#FD8D3C' :
//            d > 20   ? '#FEB24C' :
//            d > 10   ? '#FED976' :
//                       '#FFEDA0';
// }

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
// reverse long and lat were coming up ....
  // geocoder.mapboxClient
  // .geocodeReverse({
  //   latitude: user_coordinates.lat, 
  //   longitude: user_coordinates.lng
  // }, function(err, res) {
  //   console.log(err, res)
  // });

  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  var earthquakes = L.geoJSON(earthquakeData, {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place, time and magnitude of the earthquake
  onEachFeature: function(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + 
      "</p>" + "<p> Magnitude: " + feature.properties.mag + "</p>")
  },
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
   pointToLayer: function(feature, latlng) {
        return new L.circle(latlng, {
          radius: markerSize(feature.properties.mag),
          fillColor: markerColor(feature.properties.mag),
          fillOpacity: 0.75,
        })
      }
  });
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}
function createMap(earthquakes) {
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    //tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: "pk.eyJ1IjoiYW5zcGFsbWVyODgiLCJhIjoiY2tieHgzNzZsMG1yMDJycGtodGlnMzdkaCJ9.ZW-yAjmwcoaALBIJd2lWyw"
    //API_KEY = 
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: "pk.eyJ1IjoiYW5zcGFsbWVyODgiLCJhIjoiY2tieHgzNzZsMG1yMDJycGtodGlnMzdkaCJ9.ZW-yAjmwcoaALBIJd2lWyw"
    // API_KEY
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
    center: [39.64691, 141.94057],
    zoom: 3,
    layers: [streetmap, earthquakes]
  });
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
 // Add the legend to the bottomright of map
 //https://leafletjs.com/examples/choropleth/ 
var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend'),
        magnitudes = [0, 1, 2, 3, 4, 5],
        labels = [];

    for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' + 
    magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
    }

    return div;
};

legend.addTo(map);
