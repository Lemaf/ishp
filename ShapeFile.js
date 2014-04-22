var Shp = require('./lib/Shp');
var Qix = require('./lib/Qix');
var Dbf = require('./lib/Dbf');
var jsts = require('jsts');

var path = require('path');


var ShapeFile = module.exports = function(fileName) {

	this._baseName = path.normalize(fileName).replace(/\.shp$/i, '');

};

var INTERSECTS_DEFAULT_OPTIONS = {
	data: true,
	geometry: true
};

ShapeFile.prototype = {

	intersects: function(geometry, options, callback) {

		if (!callback) {
			callback = options;
			options = INTERSECTS_DEFAULT_OPTIONS;
		}

		var envelope = (!(geometry instanceof jsts.geom.Envelope)) ? geometry.getEnvelopeInternal() : geometry;

		var self = this;

		var indexes = [];

		var qixCallback = function(err, index) {

			console.log(indexes);

			if (index !== null)
				indexes.push(index);
			else
				callback(err, indexes.length ? indexes: null);
		};

		var qix = new Qix(this._baseName + '.qix');
		qix.query(envelope, qixCallback);

	}

};