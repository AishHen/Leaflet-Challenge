// Use link to get geoJSON data
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"


// Read in the data from the GeoJSON file
d3.json(geoData).then(function(response) {
  createFeatures(response.features);
});


function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

    // Create a function to increase marker size based on magnitude 
    function markerSize(magnitude) {
      return magnitude * 5;
    }

    // Define function for depth color
    function chooseColor(depth) {
      if (depth >= 2.5) return "#355E3B";
      else if (depth < 2.5 && depth >= 1.5) return "#008000";
      else if (depth < 1.5 && depth >= 0.5) return "#228B22";
      else if (depth < 0.5) return "#50C878";
      else return "#7CFC00";
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    let earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        color: "white",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9
        });
      }
    });

    // Send our earthquakes to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Create the base layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a basemaps object
    let basemaps = {
      "Street Map": street,
      "Topographic Map" : topo
      };

      // Create an overlayMaps object to hold the earthquakes layer
      let overlayMaps = {
        Earthquakes: earthquakes
        
      };

      // Create the map object to display streetmap and earthquakes layers on load
      let map = L.map("map", {
        center: [37.0902, -95.7129],
        zoom: 5,
        layers: [street, earthquakes]
      });

      // Create a layer control and pass baseMaps and overlayMaps. Add the layer control to the map.
      L.control.layers(basemaps, overlayMaps, {
        collapsed: false
      }).addTo(map);

    }