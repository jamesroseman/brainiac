/*
	-//-  Test Suite  -//-

	Test adding new location coordinates in a new brainiac structure
*/

var b = require('../index'),
	assert = require('assert');

describe('Brainiac', function(){
	describe('#add()', function(){
		it('should contain a tree with a root with one child after add', function(){
			// testStructure
			var tS = b.brainiac(8,8.024);
			tS.add(40.7974,-74.481536);
			assert.notEqual(null, tS.tree.root.left || tS.tree.root.right, ['Successfully added location to non-null brainiac structure. [1/1]']);
		});
	});
});

