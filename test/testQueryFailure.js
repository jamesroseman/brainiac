/*
	-//-  Test Suite  -//-

	Test a failing query in a new brainiac structure
*/

var b = require('../index'),
	assert = require('assert');

describe('Brainiac', function(){
	describe('#queryFail()', function(){
		it('should return [] on a nonvalid query', function(){
			// testStructure
			var tS = b.brainiac(8,8.024);
			tS.add(40.7974,-74.481536);
			assert.equal(0, tS.query(-33.8600,151.2111).length, ['Successfully failed nonvalid query in brainiac structure. [1/1]']);
		});
	});
});

