// index.js
// Interface and implementation for the brainiac structure

//	Required:
//		- LonTree

var lonTree = require('./support/lonTree');

/*
	Usage
	
	< methods >
	add - Add location coordinates to the brainiac structure
	query - Query the current structure

	< functions >
	brainiac - Create a new structure given some k and d
*/

// Given some k (k-Gon) and d (fixed distance)
// Return a new brainiac structure
var brainiac = function (k,d) {
	return lonTree.newLonTree(k,d);
};

module.exports.brainiac = brainiac;