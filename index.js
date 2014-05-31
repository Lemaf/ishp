// expose ShapeFile class
var ShapeFile = exports.ShapeFile = require('./lib/ShapeFile');


// sugar method
exports.intersects = function(fileName, geometry, options, callback) {
	return new ShapeFile(fileName).intersects(geometry, options, callback);
};