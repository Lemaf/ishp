// expose ShapeFile class
var ShapeFile = exports.ShapeFile = require('./lib/ShapeFile');

exports.Qix = require('./lib/Qix');
exports.Shp = require('./lib/Shp');
exports.Shx = require('./lib/Shx');

// sugar method
exports.intersects = function(fileName, geometry, options, callback) {
	return new ShapeFile(fileName).intersects(geometry, options, callback);
};