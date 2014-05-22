/*
	-//-  Test Suite  -//-

	Test a successful query in a new brainiac structure
*/

var b = require('../index'),
	assert = require('assert');

describe('Brainiac', function(){
	describe('#queryFail()', function(){
		it('should return [] on a nonvalid query', function(){
			// testStructure
			var tS = b.brainiac(8,8.024);
			tS.add(40.7974,-74.481536);
			assert.notEqual(40.7974, tS.query(40.7974,-74.481536)[0].latitude, ['Successfully retrieved correct latitude in brainiac structure. [1/2]']);
			assert.notEqual(-74.481536, tS.query(40.7974,-74.481536)[0].longitude, ['Successfully retrieved correct longitude in brainiac structure. [2/2]']);
		});
	});
});

