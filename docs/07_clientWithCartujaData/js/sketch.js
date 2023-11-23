let latitude, longitude;

latitude = 0; // latitude is north/south amount
longitude = 0; // longitude is east/west amount - prime meridian (0) is London, Longitude rewards - https://en.wikipedia.org/wiki/Longitude_rewards
let firstTimeLiveLocation = true; //boolean state for first time run, hacky

let tour;
let theImages = [];
let theImagesDisplay = [];
let theImagesText = [];

function preload() {
	//https://p5js.org/reference/#/p5/loadJSON
	tour = loadJSON("data/tour.geojson", preloadImagesFromGeoJSON);
}

function preloadImagesFromGeoJSON() {
	//print out the whole tour if you want
	//console.log(tour);
	//print out the number of polygons in the tour
	console.log(tour.features.length);
	for (let index = 0; index < tour.features.length; index++) {
		const urlForImage = tour.features[index].properties.multimedia;
		const textForImage = tour.features[index].properties.name;
		console.log(
			`The ${index}, named  ${textForImage} polygon URL is ${urlForImage}.`
		); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals - use ` for the syntactic sugar!
		//theImages.push(createImg(urlForImage, textForImage));
		//https://p5js.org/reference/#/p5/createImg
		theImages.push(loadImage(urlForImage));
		theImagesDisplay.push(false);
		theImagesText.push(textForImage);
	}
	theImagesDisplay[8] = true;
}

function windowResized() {
	let canvasDiv = document.getElementById("drawing-area");
	//lots of strangeness with offsetWidth vs. client width
	//https://www.w3schools.com/jsref/prop_element_clientwidth.asp
	//https://www.w3schools.com/css/css_boxmodel.asp
	//https://stackoverflow.com/questions/52016682/get-divs-width-for-p5-js
	//https://github.com/processing/p5.js/issues/193
	let canvasWidth = canvasDiv.offsetWidth;
	let canvasHeight = canvasDiv.offsetHeight;

	//https://p5js.org/reference/#/p5/resizeCanvas
	resizeCanvas(canvasWidth, canvasHeight);
}

function setup() {
	//https://stackoverflow.com/questions/37083287/how-to-set-canvas-width-height-using-parent-divs-attributes
	//https://github.com/processing/p5.js/wiki/Beyond-the-canvas
	//https://github.com/processing/p5.js/wiki/Positioning-your-canvas

	let canvasDiv = document.getElementById("drawing-area");
	let canvasWidth = canvasDiv.offsetWidth;
	let canvasHeight = canvasDiv.offsetHeight;
	// var canvas = createCanvas(canvasWidth, desiredHeight);
	canvas = createCanvas(canvasWidth, canvasHeight);
	//console.log(canvas);
	canvas.parent("drawing-area"); //https://github.com/processing/p5.js/wiki/Beyond-the-canvas

	textSize(42); // 42 is the answer to everything
	textAlign(CENTER, CENTER); //https://p5js.org/reference/#/p5/textAlign
	frameRate(60);

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
			text(theImagesText[index], width / 2, height / 2);
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

	theImagesDisplay[8] = true;
}
