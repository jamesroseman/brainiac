brainiac
========

NodeJS library for geographic localization using k-gon clouds in fixed distance.

Many applications answer questions like:
* How many ATMs are within a 5 mile radius from where I am?
* How many banks can I walk to within a mile?
* How many Chipotle restaurants are near my hotel?

These questions are structured as how many Xs are near Y. 

Or, given a fixed distance from some query coordinate, give me all locations.

The `brainiac` structure solves this problem with an augmented BST based on `k`, referring to the k-Gon clouds placed "about" every location coordinate, and `d`, the fixed distance.

See more at http://www.jamesroseman.com/projects#localization .

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