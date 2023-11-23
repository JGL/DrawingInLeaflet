let latitude, longitude;

latitude = 0; // latitude is north/south amount
longitude = 0; // longitude is east/west amount - prime meridian (0) is London, Longitude rewards - https://en.wikipedia.org/wiki/Longitude_rewards
let firstTimeLiveLocation = true; //boolean state for first time run, hacky

let tour;
let theImages = [];
let theImagesDisplay = [];
let theImagesText = [];
let theImagesPoly = [];

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
		//error getting geolocation
		console.log("geolocation not available");
		let informationTag = document.getElementById("currentLocation");
		informationTag.innerHTML = `<b>Error</b> - geolocation not available, do you have location services enabled?<br/><a href='https://support.apple.com/en-gb/HT207092'>Help for Apple iOS devices</a>.<br/><a href='https://support.google.com/accounts/answer/3467281?hl=en'>Help for Google Android devices</a>.<br/>Geolocation is <b>required</b> to be able to find yourself on the map automatically.`;
	}
	imageMode(CENTER);
}

function draw() {
	background(240);
	text(
		"Live position (lat,long) is: (" + latitude + ", " + longitude + ")",
		width / 2,
		100
	);

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

	latitude = position.latitude;
	longitude = position.longitude;

	for (let index = 0; index < tour.features.length; index++) {
		// http://turfjs.org/docs/#booleanPointInPolygon
		var pt = turf.point([position.latitude, position.longitude]);
		var poly = turf.polygon(theImagesPoly[index]);

		if (turf.booleanPointInPolygon(pt, poly)) {
			console.log(`The we are inside the ${index} polygon!`);
			theImagesDisplay[index] = true;
		} else {
			theImagesDisplay[index] = false;
		}
	}
}
