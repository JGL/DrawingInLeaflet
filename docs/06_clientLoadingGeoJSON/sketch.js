let latitude, longitude;

latitude = 0; // latitude is north/south amount
longitude = 0; // longitude is east/west amount - prime meridian (0) is London, Longitude rewards - https://en.wikipedia.org/wiki/Longitude_rewards
let firstTimeLiveLocation = true; //boolean state for first time run, hacky

let tour;
let theImages = [];
let theImagesDisplay = [];

function preload() {
  //https://p5js.org/reference/#/p5/loadJSON
  tour = loadJSON("tour.geojson", preloadImagesFromGeoJSON);
}

function preloadImagesFromGeoJSON() {
  //print out the whole tour if you want
  //console.log(tour);
  //print out the number of polygons in the tour
  console.log(tour.features.length);
  for (let index = 0; index < tour.features.length; index++) {
    const urlForImage = tour.features[index].properties.multimedia;
    const textForImage = tour.features[index].properties.name;
    console.log(`The ${index} polygon URL is ${urlForImage}.`); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals - use ` for the syntactic sugar!
    theImages.push(createImg(urlForImage, textForImage, "use-credentials"));
    //https://p5js.org/reference/#/p5/createImg
    theImagesDisplay.push(false);
  }
}

function setup() {
  createCanvas(420, 420);
  console.log(tour);
  if (geoCheck() == true) {
    //geolocation is available
    console.log("geolocation available");
    // if it's available, lets start watching the users position:
    // https://github.com/bmoren/p5.geolocation#watchposition-used-with-a-callback
    let watchOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    //optional options for watchPosition()
    watchPosition(positionChanged, watchOptions);

    let informationTag = document.getElementById("currentLocation");
    informationTag.innerHTML = `<b>Success!</b> - geolocation found.`;
  } else {
    //error getting geolocaion
    console.log("geolocation not available");
    let informationTag = document.getElementById("currentLocation");
    informationTag.innerHTML = `<b>Error</b> - geolocation not available, do you have location services enabled?<br/><a href='https://support.apple.com/en-gb/HT207092'>Help for Apple iOS devices</a>.<br/><a href='https://support.google.com/accounts/answer/3467281?hl=en'>Help for Google Android devices</a>.<br/>Geolocation is <b>required</b> to be able to find yourself on the map automatically.`;
  }
  imageMode(CENTER);
}

function draw() {
  background(240);
  for (let index = 0; index < theImagesDisplay.length; index++) {
    if (theImagesDisplay[index]) {
      image(theImages[index], width / 2, height / 2);
    }
  }
}

function positionChanged(position) {
  print("lat: " + position.latitude);
  print("long: " + position.longitude);

  let closestRange = 9999999; //massive value to allow real ranges to beat this default value
  let indexOfImageWithClosestRange = -1; //negative index to allow us to detect when we have a real index that is close enough

  for (let index = 0; index < tour.features.length; index++) {
    theImagesDisplay[index] = false; //default to displaying no images

    //TODO: turf.js fun here!
    // const currentWaypointLatitude = Number(tour.waypoints[index].latitude);
    // const currentWaypointLongitude = Number(tour.waypoints[index].longitude);
    // const currentWaypointRange = Number(tour.waypoints[index].range);

    // // BUG - I don't believe this is reporting an accurate position
    // // https://github.com/bmoren/p5.geolocation#calcgeodistance
    // let distanceFromWaypointToHere = calcGeoDistance(
    //   position.latitude,
    //   position.longitude,
    //   currentWaypointLatitude,
    //   currentWaypointLongitude,
    //   "km"
    // );
    // distanceFromWaypointToHere *= 1000; //multiply distance by 1000 to get distance in metres

    // console.log(
    //   `The ${index} range from here ${distanceFromWaypointToHere}, the range of the waypoint is ${currentWaypointRange}.`
    // );

    // if (
    //   distanceFromWaypointToHere < closestRange &&
    //   distanceFromWaypointToHere < currentWaypointRange
    // ) {
    //   //then this is the closest waypoint so far in the array
    //   //so set the closestRange to be distanceFromWaypointToHere
    //   closestRange = distanceFromWaypointToHere;
    //   indexOfImageWithClosestRange = index;
    // }
  }

  if (indexOfImageWithClosestRange > -1) {
    //then we have a waypoint that is close enough in terms of range
    theImagesDisplay[indexOfImageWithClosestRange] = true;
  }
}
