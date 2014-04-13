// intervalTree.js
// Interface and implementation for intervalTree class

//	Required:
//		- TreeNode
//		- Coord
var tn = require('./treeNode'),
	coord = require('./coord');

// IntervalTree class
function IntervalTree(root){
	this.root = root;
}

// IntervalTree methods
IntervalTree.prototype.add = function(toAdd){
	var curr = this.root;
	// Traverse tree until first proper leaf
	var done = false;
	while (!done){
		var middle = ((curr.intervalj - curr.intervali)/2) + curr.intervali;
		// Right
		if (toAdd.val > middle){
			if (curr.right === null){
				curr.right = tn.newTreeNode(middle, curr.intervalj);
				done = true;
			}
			for (var i=0; i<curr.data.length; i++){
				if (curr.data[i].val > middle){
					curr.right.data.push(curr.data[i]);
					curr.right.data.splice(i,1);
				}
			}
			curr = curr.right;
		}
		// Left
		else{
			if (curr.left === null){
				curr.left = tn.newTreeNode(curr.intervali, middle);
				done = true;
			}
			for (var j=0; j<curr.data.length; j++){
				if (curr.data[j].val <= middle){
					curr.left.data.push(curr.data[j]);
					curr.left.data.splice(j,1);
				}
			}
			curr = curr.left;
		}
	}
	// Got leaf, now add your new data to it
	curr.data.push(toAdd);
};

// Interface for IntervalTree class
// Create a new IntervalTree
var newIntervalTree = function(root){
	return new IntervalTree(root);
};
module.exports.newIntervalTree = newIntervalTree;
module.exports.newTreeNode = tn.newTreeNode;
module.exports.newCoord = coord.newCoord;
module.exports.newCloudCoord = coord.newCloudCoord;
module.exports.newCloudCoordBorder = coord.newCloudCoordBorder;




var root = tn.newTreeNode(-90,90);
var toAdd = coord.newCloudCoord(40.689292,-74.044507,4);
var i = newIntervalTree(root);
i.add(toAdd);
for (var c=0; c<toAdd.borders.length; c++){
	toAdd.borders[c].val = toAdd.borders[c].lat;
	i.add(toAdd.borders[c]);
}
module.exports.toAdd = toAdd;
module.exports.i = i;

