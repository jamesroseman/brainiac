brainiac
========

NodeJS library for geographic localization using k-gon clouds in fixed distance.

Many applications answer questions like:
* How many ATMs are within a 5 mile radius from where I am?
* How many banks can I walk to within a mile?
* How many Chipotle restaurants are near my hotel?

These questions are structured as how many X are near Y. 

Or, given a fixed distance from some query coordinate, give me all locations.

To answer this question (and solve this problem), I used an augmented binary search tree.

See more at http://www.260.jamesroseman.com .

This project was completed for the Comp260 course offered at Tufts University under Greg Aloupis and Andrew Winslow.

##usage

> // Include the package
>var lonTree = require('./lonTree');
>
>// Create a new longitude tree
>var lt = ltp.newLonTree(k,d);
>var tree = lt.tree;
>
>// Add some location points
>tree.add(lat, lon);
>tree.add(lat, lon);
>tree.add(lat, lon);
>
>// Finally, query a coordinate
>tree.query(lat, lon);




