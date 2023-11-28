let latitude = 0; // latitude is north/south amount
let longitude = 0; // longitude is east/west amount - prime meridian (0) is London, Longitude rewards - https://en.wikipedia.org/wiki/Longitude_rewards

let tour;
let theImages = [];
let theImagesDisplay = [];
let theImagesText = [];
let theImagesPoly = [];
let distancesToCentresOfPolys = [];

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
		const polyForImage = tour.features[index].geometry.coordinates;
		console.log(
			`The ${index}, named  ${textForImage} polygon  ${polyForImage} is ${urlForImage}.`
		);
		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals - use ` for the syntactic sugar!
		//theImages.push(createImg(urlForImage, textForImage));
		//https://p5js.org/reference/#/p5/createImg
		theImages.push(loadImage(urlForImage));
		theImagesDisplay.push(false);
		theImagesText.push(textForImage);
		theImagesPoly.push(polyForImage);
		distancesToCentresOfPolys.push(-1);
	}
	//debugging
	//theImagesDisplay[8] = true;
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

	textSize(21); // 42/2 is the answer to everything
	textAlign(CENTER, CENTER); //https://p5js.org/reference/#/p5/textAlign
	frameRate(60);

	//console.log(tour);
	if (geoCheck() == true) {
		//geolocation is available
		console.log("geolocation available");
		// if it's available, lets start watching the users position:
		// https://github.com/bmoren/p5.geolocation#watchposition-used-with-a-callback
		let watchOptions = {
			enableHighAccuracy: true,
			timeout: 1000,
			maximumAge: 0,
		};

		//optional options for watchPosition()
		watchPosition(positionChanged, watchOptions);

		//https://github.com/bmoren/p5.geolocation
		locationData = getCurrentPosition();
		latitude = locationData.latitude;
		longitude = locationData.longitude;

		let informationTag = document.getElementById("currentLocation");
		informationTag.innerHTML = `<b>Success!</b> - geolocation found.`;
	} else {
		//error getting geolocation
		console.log("geolocation not available");
		let informationTag = document.getElementById("currentLocation");
		informationTag.innerHTML = `<b>Error</b> - geolocation not available, do you have location services enabled?<br/><a href='https://support.apple.com/en-gb/HT207092'>Help for Apple iOS devices</a>.<br/><a href='https://support.google.com/accounts/answer/3467281?hl=en'>Help for Google Android devices</a>.<br/>Geolocation is <b>required</b> to be able to find yourself on the map automatically.`;
	}
	imageMode(CENTER);
}

function draw() {
	background(240);
	fill("cornflowerblue");
	text(`Live Lat: ${latitude}`, width / 2, 100);
	text(`Live Long: ${longitude}`, width / 2, 120);
	text(
		"Green indicates you are inside the poly, red indicates you are outside. Live distance to the centre of the poly is also displayed.",
		width / 2,
		140
	);

	for (let index = 0; index < distancesToCentresOfPolys.length; index++) {
		if (theImagesDisplay[index]) {
			fill("limegreen");
		} else {
			fill("tomato");
		}
		text(
			`${theImagesText[index]}. You are ${distancesToCentresOfPolys[index]} km away from the centre of this feature.`,
			width / 2,
			160 + index * 20
		);
	}
}

function positionChanged(position) {
	print("lat: " + position.latitude);
	print("long: " + position.longitude);

	latitude = position.latitude;
	longitude = position.longitude;

	for (let index = 0; index < tour.features.length; index++) {
		// http://turfjs.org/docs/#booleanPointInPolygon
		// https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.1
		// A position is an array of numbers.  There MUST be two or more
		//    elements.  The first two elements are longitude and latitude, or
		//    easting and northing, precisely in that order and using decimal
		//    numbers.  Altitude or elevation MAY be included as an optional third
		//    element
		// I had the below the wrong way around!
		var pt = turf.point([position.longitude, position.latitude]);
		var poly = turf.polygon(theImagesPoly[index]);
		var centre = turf.centerOfMass(poly);
		var distance = turf.distance(pt, centre);

		distancesToCentresOfPolys[index] = distance;

		if (turf.booleanPointInPolygon(pt, poly)) {
			console.log(`The we are inside the ${index} polygon!`);
			theImagesDisplay[index] = true;
		} else {
			theImagesDisplay[index] = false;
		}
	}
}
