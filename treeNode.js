// treeNode.js
// Interface and implementation for treeNode class

// Interval TreeNode class
function TreeNode(intervali, intervalj) {
	this.intervali = intervali;
	this.intervalj = intervalj;
	this.left = null;
	this.right = null;
	this.isLeaf = true;
	this.data = [];
}

// Interval tree node methods
TreeNode.prototype.isInInterval = function(query){
	return isInInterval(query, this.intervali, this.intervalj);
};
TreeNode.prototype.whichThird = function(query){
	var third = (this.intervalj - this.intervali)/3;
	if (isInInterval(query, this.intervali, this.intervali+third)) {
		return 1;
	}
	if (isInInterval(query, this.intervali+third, this.intervalj-third)) {
		return 2;
	}
	if (isInInterval(query, this.intervalj-third, this.intervalj)) {
		return 3;
	}
	return null;
};

// Private methods for TreeNode class
var isInInterval = function (query, i, j) {
	if (i <= query && query <= j) {
		return true;
	}
	return false;
};

// Interface for TreeNode class
// Create a new TreeNode
var newTreeNode = function(intervali, intervalj){
	return new TreeNode(intervali, intervalj);
};

// Export relevant interface methods
module.exports.newTreeNode = newTreeNode;