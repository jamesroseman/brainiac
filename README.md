brainiac
========

NodeJS library for geographic localization using k-gon clouds in fixed distance.

Many applications do things like:
* Give me a list of all the restaurants within 5 miles of where I am.
* Give me a list of all the markers people have left within a 10 mile radius of where I am.
* Give me a list of all the photos people have taken within 5 blocks of where I am.

These questions are structured as give me a list of all the Xs are near Y. 

Or, given a fixed distance from some query coordinate, give me a list of all location coordinates.

The `brainiac` structure solves this problem with an augmented BST based on `k`, referring to the k-Gon clouds placed "about" every location coordinate, and `d`, the fixed distance.

The `brainiac` structure uses the <a target="_blank" href="http://en.wikipedia.org/wiki/Haversine_formula">haversine formula</a> to compute distance between coordinates.

<a href="http://www.jamesroseman.com/projects/#localization">Read more about the project here.</a>

##usage

```javascript
var b = require('brainiac');
var brain = b.brainiac(k,d);

// Add coordinates
brain.add(40.7974,-74.481536);
brain.add(34.020029,-118.286931);
brain.add(29.426468,-98.491233);
brain.add(37.62261,-122.37804);
brain.add(61.59938,-149.126804);
brain.add( 39.653671,-104.959502);
brain.add(47.850015,-122.279457);
brain.add(52.114942,-106.632519);
brain.add(47.622767,-122.33668);
brain.add(41.643112,-88.001369);

// Query against the structure
var query = brain.query(41.643155,-88.001322)

// Return queries are of the following format
query === [
	{
		latitude: 41.643112, 
		longitude: -88.001369,
		borders: [...]
	},
	...
]
```

##efficiency

Compare the `brainiac` structure to some simple method of iterating through all location coordinates and computing distance to some query coordinate.

The `brainiac` structure can be written as:

```
Search an augmented binary search tree for a longitude interval.
Search some augmented binary search tree for a latitude interval over some longitude interval.
For all members of a node's data set within that tree:
	Compare haversine distance to some query coordinate.
	If less than d, add to return list.
Return return list.
```

Or, in a time complexity analysis as follows:

```
O(logn) + O(logn) + O(m)
```

Where `m` is the average density of these created "interval squares".

<a target="_blank" href="http://www.jamesroseman.com/projects#localization-analysis">Read more about the efficiency here.</a>
