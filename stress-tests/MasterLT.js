var t = require('./testSuite');
var args = process.argv.slice(2);

t.LT(args[1],1000,args[0],8.04672);