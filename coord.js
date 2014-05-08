// coord.js
// Interface and implementation for coord class

// Coord class
function Coord(latitude, longitude) {
	this.lat = latitude;
	this.lon = longitude;
}

// Interface for Coord class
// Create a new Coord
var newCoord = function(latitude, longitude){
	return new Coord(latitude, longitude);
};
module.exports.newCoord = newCoord;




// Class of a coordinate with a k-cloud
function CloudCoord(latitude, longitude, borders){
	this.lat = latitude;
	this.lon = longitude;
	// List of k-cloud border vertices
	this.borders = borders;
}

// Interface for CloudCoord class
// Create a new CloudCoord
var newCloudCoord = function(latitude, longitude, k, d){
	var retCloudCoord = new CloudCoord(latitude, longitude, []);
	// var d = 8.04672; // 5 miles in km
	var borders = createBorders(latitude, longitude, k, d);
	for (var i=0; i<borders.length; i++){
		borders[i] = newCloudCoordBorder(borders[i].lat, borders[i].lon, retCloudCoord);
	}
	retCloudCoord.borders = borders;
	return retCloudCoord;
};
module.exports.newCloudCoord = newCloudCoord;
// Convert degrees to radians
Number.prototype.toRad = function(){
	return (this*Math.PI) / 180;
};
var toRad = function(degree){
	return (degree*Math.PI) / 180;
};
// Convert radians to degrees
Number.prototype.toDeg = function(){
	return (this*180) / Math.PI;
};
var toDeg = function(degree){
	return (degree*180) / Math.PI;
};
/**
 *
 * http://www.movable-type.co.uk/scripts/latlon.js
 * 
 * Creates a point on the earth's surface at the supplied latitude / longitude
 *
 * @constructor
 * @param {Number} lat: latitude in numeric degrees
 * @param {Number} lon: longitude in numeric degrees
 * @param {Number} [rad=6371]: radius of earth if different value is required from standard 6,371km
 */
function LatLon(lat, lon, rad) {
	if (typeof(rad) == 'undefined') rad = 6371;  // earth's mean radius in km
	// only accept numbers or valid numeric strings
	this._lat = typeof(lat)=='number' ? lat : typeof(lat)=='string' && lat.trim()!='' ? +lat : NaN;
	this._lon = typeof(lon)=='number' ? lon : typeof(lon)=='string' && lon.trim()!='' ? +lon : NaN;
	this._radius = typeof(rad)=='number' ? rad : typeof(rad)=='string' && trim(lon)!='' ? +rad : NaN;
}
/**
 * 
 * http://www.movable-type.co.uk/scripts/latlon.js 
 * 
 * Returns the destination point from this point having travelled the given distance (in km) on the 
 * given initial bearing (bearing may vary before destination is reached)
 *
 *   see http://williams.best.vwh.net/avform.htm#LL
 *
 * @param   {Number} brng: Initial bearing in degrees
 * @param   {Number} dist: Distance in km
 * @returns {LatLon} Destination point
 */
LatLon.prototype.destinationPoint = function(brng, dist) {
	dist = typeof(dist)=='number' ? dist : typeof(dist)=='string' && dist.trim()!='' ? +dist : NaN;
	dist = dist/this._radius;  // convert dist to angular distance in radians
	brng = brng.toRad();  // 
	var lat1 = this._lat.toRad(), lon1 = this._lon.toRad();

	var lat2 = Math.asin( Math.sin(lat1)*Math.cos(dist) + 
						Math.cos(lat1)*Math.sin(dist)*Math.cos(brng) );
	var lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(dist)*Math.cos(lat1), 
						Math.cos(dist)-Math.sin(lat1)*Math.sin(lat2));
	lon2 = (lon2+3*Math.PI) % (2*Math.PI) - Math.PI;  // normalise to -180..+180º

	return new LatLon(lat2.toDeg(), lon2.toDeg());
};
/**
 * Returns the distance from this point to the supplied point, in km 
 * (using Haversine formula)
 *
 * from: Haversine formula - R. W. Sinnott, "Virtues of the Haversine",
 *       Sky and Telescope, vol 68, no 2, 1984
 *
 * @param   {LatLon} point: Latitude/longitude of destination point
 * @param   {Number} [precision=4]: no of significant digits to use for returned value
 * @returns {Number} Distance in km between this point and destination point
 */
LatLon.prototype.distanceTo = function(point, precision) {
  // default 4 sig figs reflects typical 0.3% accuracy of spherical model
  if (typeof precision == 'undefined') precision = 4;
  
  var R = this._radius;
  var lat1 = this._lat.toRad(), lon1 = this._lon.toRad();
  var lat2 = point._lat.toRad(), lon2 = point._lon.toRad();
  var dLat = lat2 - lat1;
  var dLon = lon2 - lon1;

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1) * Math.cos(lat2) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d.toPrecisionFixed(precision);
};

// Create CloudCoordBorders from any given coordinate
var createBorders = function(latitude, longitude, k, d){
	var startPoint = new LatLon(latitude, longitude);
	var borders = [];
	// Create border vertices in QII on graph
	// 90 degrees QII split by a quarter of the polygon
	//    vertices (1 offset)
	// Theta must be measured in radians clockwise from
	//    north of starting vertex (absolute bearing)
	var thetaDeg = 90 / ((k/4) + 1);
	for (i=1; i<=k+4; i++) {
		// Only if point doesn't lie on x or y-axis
		if (thetaDeg*i%90 !== 0){
			var border = { theta: toRad(thetaDeg*i), thetaDeg: thetaDeg*i };
			borders.push(border);
		}
	}
	// Computer coordinates of these borders
	for (i=0; i<borders.length; i++){
		// Haversine formula solved for 2nd coordinates
		var secondCoord = startPoint.destinationPoint(borders[i].thetaDeg,d);
		borders[i].lat = secondCoord._lat;
		borders[i].lon = secondCoord._lon;
	}
	return borders;
};
module.exports.newCloudCoord = newCloudCoord;


// Class of a coordinate that is a border of a k-cloud
function CloudCoordBorder(latitude, longitude, centerCoord){
	this.lat = latitude;
	this.lon = longitude;
	// The k-cloud center
	this.center = centerCoord;
}

// Interface for CloudCoord class
// Create a new CloudCoord
var newCloudCoordBorder = function(latitude, longitude, centerCoord){
	return new CloudCoordBorder(latitude, longitude, centerCoord);
};
module.exports.newCloudCoordBorder = newCloudCoordBorder;