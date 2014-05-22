/*
	-//-  Test Suite  -//-

	Test creation of a new brainiac structure
*/

var b = require('../index'),
	assert = require('assert');

describe('Brainiac', function(){
	describe('#new()', function(){
		it('should not return null value on new', function(){
			assert.notEqual(null, b.brainiac(8,8.024), ['Successfully created non-null brainiac structure. [1/2]']);
			assert.notEqual(null, b.brainiac(16,8.024), ['Successfully created non-null brainiac structure. [2/2]']);
		});
	});
});

