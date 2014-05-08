// lonTree.js
// Interface and implementation for the longitude interval tree

//	Required:
//		- IntervalTree

var it = require('./intervalTree');


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


// lonTree class
function LonTree(k,d){
	this.tree = null;
	this.k = k;
	this.d = d;

	// Private methods
	this.lon = function(data){
		return data.lon;
	};
	this.lat = function(data){
		return data.lat;
	};
	this.breakCondition = function(curr){
		return Math.abs(curr.intervalj-curr.intervali) <= 1.25;
	};
	this.addTree = function(node){
		node.tree = it.newIntervalTree(-90,90);
	};
}


// IntervalTree essentials
var newLonTree = function(k,d){
	var retLonTree = new LonTree(k,d);
	retLonTree.tree = it.newIntervalTree(-180,180,{'tree':it.newIntervalTree(-90,90)});
	return retLonTree;
};

module.exports.newLonTree = newLonTree;


LonTree.prototype.add = function(cloudLat,cloudLon){
	var toAdd = it.newCloudCoord(cloudLat,cloudLon,this.k,this.d);
	this.tree.addCloud(toAdd,this.breakCondition,this.lon,true);
};
LonTree.prototype.query = function(queryLat,queryLon){
	var latTree = null;
	var middle = 0;

	var curr = this.tree.root;
	var done = false;
	// Search for the correct LatTree
	while (!done){
		middle = ((curr.intervalj - curr.intervali)/2) + curr.intervali;
		if (queryLon > middle){
			if (curr.right !== null){
				curr = curr.right;
			}
			else{
				latTree = curr.tree;
				done = true;
			}
		}
		else{
			if (curr.left !== null){
				curr = curr.left;
			}
			else{
				latTree = curr.tree;
				done = true;
			}
		}
	}

	// Search for the grid points
	var data = null;
	curr = latTree.root;
	done = false;
	// Search for the correct LatTree
	while (!done){
		middle = ((curr.intervalj - curr.intervali)/2) + curr.intervali;
		if (queryLat > middle){
			if (curr.right !== null){
				curr = curr.right;
			}
			else{
				data = curr.data;
				done = true;
			}
		}
		else{
			if (curr.left !== null){
				curr = curr.left;
			}
			else{
				data = curr.data;
				done = true;
			}
		}
	}

	var retItems = [];
	var queryLatLon = new LatLon(queryLat,queryLon);
	// Run through data, check distance to query
	for (var i=0; i<data.length; i++){
		var cmp = data[i];

		if (typeof(data[i].center) !== 'undefined'){
			cmp = data[i].center;
		}

		var cmpll = new LatLon(cmp.lat,cmp.lon);

		var unique = true;
		for (var j=0; j<retItems.length; j++){
			if (cmp === retItems[j]){
				unique = false;
			}
		}

		if (queryLatLon.distanceTo(cmpll) <= this.d && unique){
			retItems.push(cmp);
		}
	}

	return retItems;
};














