d3.csv("assets/data/map_2018.csv", function(error, mapData_2018) {

  // Throw an error if one occurs
  if (error) throw error;

  // Format the mapData fields
  mapData_2018.forEach(function(data) {
      data.trip_count = +data.trip_count;
      data.latitude = +data.latitude;
      data.longitude = +data.longitude;    
  });

  var locMarkers = [];
  
  mapData_2018.forEach((data) => {
    var coordinates = [data.latitude, data.longitude]
    locMarkers.push(
      L.circle(coordinates, {
        stroke: false,
        fillOpacity: 0.75,
        color: "blue",
        fillColor: "blue",
        // fillColor: getColor(feature.properties.mag),
        radius: markerSize(data.trip_count)
      })
      .bindPopup("<h3>" + data.start_station_name +
      "</h3><hr><p class='tooltip_1'>Trip-Count: " + data.trip_count + "</p>")
    )
  });
  
  var stations_2018 = L.layerGroup(locMarkers);

  var NYC_2018 = L.layerGroup();
  var DC_2018 = L.layerGroup();
  var Chicago_2018 = L.layerGroup();

  // BaseMaps object to hold our base layers
  var [baseMaps, defaultMap] = createBaseMap();

  // The map, giving it the defaultmap and stations 2018 layers to display on load
  var myMap = L.map("map", {
    center: [40.7590, -73.9845],
    zoom: 12,
    layers: [defaultMap, NYC_2018, stations_2018]
  });

  // Adding mapData FirstYear layer to the map
  d3.csv("assets/data/map_firstyear.csv", function(error, mapData_firstyear){

    // Throw an error if one occurs
    if (error) throw error;

    mapData_firstyear.forEach(function(data) {
      data.trip_count = +data.trip_count;
      data.latitude = +data.latitude;
      data.longitude = +data.longitude;    
    });

    var locMarkers_fy = [];
    
    mapData_firstyear.forEach((data) => {
      var coordinates = [data.latitude, data.longitude]
      locMarkers_fy.push(
        L.circle(coordinates, {
          stroke: false,
          fillOpacity: 0.75,
          color: "red",
          fillColor: "red",
          // fillColor: getColor(feature.properties.mag),
          radius: markerSize(data.trip_count)
        })
        .bindPopup("<h3>" + data.start_station_name +
        "</h3><hr><p class='tooltip_1'>Trip-Count: " + data.trip_count + "</p>")
      )
    });
  
    var stations_firstyear = L.layerGroup(locMarkers_fy);

    var groupedOverlays = {
      "Cities":{
          "NYC": NYC_2018,
          "DC": DC_2018,
          "Chicago": Chicago_2018
      },
      "Year":{
        "2018": stations_2018,
        "FirstYear": stations_firstyear
      }
    };

    var options = {
      exclusiveGroups: ["Cities"],
      groupCheckboxes: true
    };
  
    var controlLayers = L.control.groupedLayers(baseMaps, groupedOverlays, options);
    myMap.addControl(controlLayers);

  });

  myMap.on('overlayadd', function (e) {
    if (myMap.hasLayer(NYC_2018)){
      myMap.setView(new L.LatLng(40.7590, -73.9845), 12);
    }else if(myMap.hasLayer(DC_2018)){
      myMap.setView(new L.LatLng(38.8893, -77.0502), 13);
    }else if(myMap.hasLayer(Chicago_2018)){
      myMap.setView(new L.LatLng(41.8757, -87.6243), 13);
    }
  });

});


function markerSize(trip_count) {
  return trip_count/500;
}

function createBaseMap() {

  // satellite, dark, outdoors and streets map layers
  var streetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var outdoorsMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  var darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  // BaseMaps object to hold our base layers
  var baseMaps = {
    "Satelite": satelliteMap,
    "Grayscale": darkMap,
    "Outdoors": outdoorsMap,
    "Streets": streetMap
  };

  return [baseMaps, streetMap];
}