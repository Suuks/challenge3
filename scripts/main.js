//NASA API

function getAPIdata() {

// construct request
var request = 'https://epic.gsfc.nasa.gov/api/natural';

// get current weather
fetch(request)

// parse response to JSON format
.then(function(response) {
return response.json();
})

// do something with response
.then(function(response) {
// show full JSON object
var nasaDate = new Date(response[0].date);
console.log(response);
var nasaDay = nasaDate.getDate();
var nasaMonth = nasaDate.getMonth() + 1;


if (nasaDay < 10) {
nasaDay = '0' + nasaDay;
}

if (nasaMonth < 10) {
nasaMonth = '0' + nasaMonth;
}

document.getElementById('earth').src = 'https://epic.gsfc.nasa.gov/archive/natural/' + nasaDate.getFullYear() + '/' + nasaMonth +'/' + nasaDay + '/png/' + response[0].image + '.png';

});
}


// init data stream
getAPIdata();


//WEATHERBOX API

// Set api token for mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoic3V1a3MiLCJhIjoiY2ttdW16emQ3MTJ1eTJwcG14NzdxaGtiMyJ9.R4c-9w-o9b4bkH_Aq8U0Ig';

// api token for openWeatherMap
var openWeatherMapUrl = 'https://api.openweathermap.org/data/2.5/weather';
var openWeatherMapUrlApiKey = 'b7f6cdd56b0d9d83d2ea95eaae8d137c';

// Determine cities
var cities = [
  {
    name: 'Amsterdam',
    coordinates: [4.895168, 52.370216]
  },
  {
    name: 'Rotterdam',
    coordinates: [4.47917, 51.9225]
  },
  {
    name: 'Nijmegen',
    coordinates: [5.85278, 51.8425]
  },
  {
    name: 'Maastricht',
    coordinates: [5.68889, 50.84833]
  },
  {
    name: 'Groningen',
    coordinates: [6.56667, 53.21917]
  },
  {
    name: 'Enschede',
    coordinates: [6.89583, 52.21833]
  },
];

// Initiate map
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v11',
  center: [4.47917, 51.9225],
  zoom: 5
});


// get weather data and plot on map
map.on('load', function () {
  cities.forEach(function(city) {
    // Usually you do not want to call an api multiple times, but in this case we have to
    // because the openWeatherMap API does not allow multiple lat lon coords in one request.
    var request = openWeatherMapUrl + '?' + 'appid=' + openWeatherMapUrlApiKey + '&lon=' + city.coordinates[0] + '&lat=' + city.coordinates[1];

    // Get current weather based on cities' coordinates
    fetch(request)
      .then(function(response) {
        if(!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then(function(response) {
        // Then plot the weather response + icon on MapBox
        plotImageOnMap(response.weather[0].icon, city)
      })
      .catch(function (error) {
        console.log('ERROR:', error);
      });
  });
});

function plotImageOnMap(icon, city) {
  map.loadImage(
    'http://openweathermap.org/img/w/' + icon + '.png',
    function (error, image) {
      if (error) throw error;
      map.addImage("weatherIcon_" + city.name, image);
      map.addSource("point_" + city.name, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [{
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: city.coordinates
            }
          }]
        }
      });
      map.addLayer({
        id: "points_" + city.name,
        type: "symbol",
        source: "point_" + city.name,
        layout: {
          "icon-image": "weatherIcon_" + city.name,
          "icon-size": 1.3
        }
      });
    }
  );
}
