var Shp = require('./lib/Shp');
var Qix = require('./lib/qix/Query');
var Dbf = require('./lib/Dbf');
var jsts = require('jsts');


var fs = require('fs');

var ShapeFile = module.exports = function(path) {

	this._baseName = path.replace(/[^.]$/, '');

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

		if (options.data && options.geometry) {

			var envelope = (geometry instanceof jsts.geom.Envelope) ? geometry : geometry.getEnvelopeInternal();

			var qixCallback, self = this;

			if (options.geometry) {

				qixCallback = function(err, index) {
					console.log(index);
				};
			}

			var qix = new Qix(this._baseName);
			qix.query(envelope, qixCallback);

		} else
			callback(new Error('Invalid options!'), null);
	}

};