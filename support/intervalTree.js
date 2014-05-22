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


/*
 *
 * Modifies the internal tree structure to add data
 *
 * @param {Data} toAdd : data being added to the tree
 * @param {Function} breakCondition : when to break, used to set limit of min interval
 * @param {Function} latLon : function to determine which element will be "val" in tree
 *
*/
IntervalTree.prototype.addCloud = function(toAdd,breakCondition,latLon,shouldAddTree){
	this.add(toAdd,breakCondition,latLon,shouldAddTree);
	for (var i=0; i<toAdd.borders.length; i++){
		this.add(toAdd.borders[i],breakCondition,latLon,shouldAddTree);
	}
};
/*
 *
 * Modifies the internal tree structure to add data
 *
 * @param {Data} toAdd : data being added to the tree
 * @param {Function} breakCondition : when to break, used to set limit of min interval
 * @param {Function} latLon : function to determine which element will be "val" in tree
 *
*/
IntervalTree.prototype.add = function(toAdd,breakCondition,latLon,shouldAddTree){
	var addStack = {
		trees: [],
		vals: []
	};
	var lat = function(x){ return x.lat; };
	var curr = this.root;
	toAdd.val = latLon(toAdd);

	// For the next tree
	var toAddCopy = {};
	toAddCopy.lat = toAdd.lat;
	toAddCopy.lon = toAdd.lon;

	if (typeof(toAdd.center) !== 'undefined'){
		toAddCopy.center = toAdd.center;
	}

	if (typeof(toAdd.borders) !== 'undefined'){
		toAddCopy.borders = toAdd.borders;
	}

	// Traverse tree until first proper leaf
	var done = false;
	while (!done){
		
		var middle = ((curr.intervalj - curr.intervali)/2) + curr.intervali;

		if (breakCondition(curr)){
			break;
		}

		// Right child
		if (toAdd.val > middle){
			if (curr.right === null){
				curr.right = tn.newTreeNode(middle, curr.intervalj);
				if (shouldAddTree){
					curr.right.tree = newIntervalTree(-90,90);
				}
				done = true;
			}
			// Copy the data from here to the child
			for (var i=curr.data.length-1; i>=0; i--){
				if (curr.data[i].val > middle){
					curr.right.data.push(curr.data[i]);
					if (shouldAddTree){
						curr.right.tree.add(toAddCopy,breakCondition,lat,false);
					}
					curr.data.splice(i,1);
				}
			}
			curr = curr.right;
		}

		// Left child
		else{
			if (curr.left === null){
				curr.left = tn.newTreeNode(curr.intervali, middle);
				if (shouldAddTree){
					curr.left.tree = newIntervalTree(-90,90);
				}
				done = true;
			}
			// Copy the data from here to the child
			for (var i=curr.data.length-1; i>=0; i--){
				if (curr.data[i].val <= middle){
					curr.left.data.push(curr.data[i]);
					if (shouldAddTree){
						curr.left.tree.add(toAddCopy,breakCondition,lat,false);
					}
					curr.data.splice(i,1);
				}
			}
			curr = curr.left;
		}
	}
	// Got leaf, now add your new data to it
	curr.data.push(toAdd);
	if (shouldAddTree){
		curr.tree.add(toAddCopy,breakCondition,lat,false);
	}
};
/*
 *
 * Returns truth value for whether or not data was found in tree
 *
 * @param {Data} toSearch : data being searched within the tree
 *
*/
IntervalTree.prototype.search = function(toSearch){
	if (searchByRoot(this.root,toSearch) === true){
		return true;
	}
	return false;
};


// Interface for IntervalTree class
// Create a new IntervalTree
var newIntervalTree = function(intervali,intervalj,optData){
	return new IntervalTree(tn.newTreeNode(intervali,intervalj,optData));
};

/*
 * Recursively searches the IntervalTree for a value in a node's data
 *
 * @param {Node} root : the root of the current iterative search
 * @param {Data} toSearch : the value of the data being searched for
*/
var searchByRoot = function(root,toSearch){
	if (root.left !== null){
		return searchByRoot(root.left,toSearch);
	}
	if (root.right !== null){
		return searchByRoot(root.right,toSearch);
	}
	for (var i=0; i<root.data.length; i++){
		if (root.data[i].val === toSearch){
			return true;
		}
	}
};

module.exports.newIntervalTree = newIntervalTree;
// module.exports.newTreeNode = tn.newTreeNode;
module.exports.newCoord = coord.newCoord;
module.exports.newCloudCoord = coord.newCloudCoord;
// module.exports.newCloudCoordBorder = coord.newCloudCoordBorder;