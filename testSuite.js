// testSuite.js

// Contains functions used by tests

//	Required:
//		- LonTree

var lt = require('./lonTree');



// LATLON

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
  return d.toFixed(precision);
};


var randb = function(l,u){
     return Math.floor((Math.random() * (u-l+1))+l);
};
var genCoor = function(){
	return {lat:randb(-85,85), lon:randb(-180,180)};
};
var genCoorList = function(n){
	var retList = [];
	for (var i=0; i<=n; i++){
		retList.push(genCoor());
	}
	return retList;
};
var gen1m = function(){
	return genCoorList(1000000);
};
var gen1t = function(){
	return genCoorList(1000);
};

// Standard test for all lonTree tests
var testLT = function(i,q,k,d){
	// Get list of "items"
	var coors = genCoorList(i);

	// Get list of "queries"
	var queries = genCoorList(q);

	// Create data structure
	var l = lt.newLonTree(k,d);

	// Populate data structure
	for (var index=0; index<coors.length; index++){
		l.add(coors[index].lat,coors[index].lon);
	}

	// Make queries
	for (var j=0; j<queries.length; j++){
		l.query(queries[j].lat,queries[j].lon);
	}
};

// Standard test for all list tests
var testL = function(i,q,d){
	// Get list of "items"
	var coors = genCoorList(i);

	// Get list of "queries"
	var queries = genCoorList(q);

	// Create data structure
	var l = [];

	// Populate data structure
	for (var index=0; index<coors.length; index++){
		l.push(coors[index]);
	}

	// Make queries
	for (var j=0; j<queries.length; j++){
		var qLat = queries[j].lat;
		var qLon = queries[j].lon;

		var qLL = new LatLon(qLat,qLon);

		for (var c=0; c<coors.length; c++){
			var nearList = [];
			var cLL = new LatLon(coors[c].lat,coors[c].lon);
			if (qLL.distanceTo(cLL) <= d){
				nearList.push(coors[c]);
			}
		}
	}
};

module.exports.LT = testLT;
module.exports.L = testL;