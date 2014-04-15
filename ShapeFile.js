var Shp = require('./lib/Shp');
var Qix = require('./lib/qix/Query');
var Dbf = require('./lib/Dbf');
var jsts = require('jsts');


var fs = require('fs');

var ShapeFile = module.exports = function(path) {

	['Qix', 'Dbf', 'Shp', 'Shx'].forEach(function(ext) {
		this['_pathTo' + ext] = path.replace(/[^.]+$/, ext.toLowerCase());
	}, this);

};

ShapeFile.prototype = {

	intersects: function(geometry) {

		var envelope = (!(geometry instanceof jsts.geom.Envelope)) ? geometry.getEnvelopeInternal() : geometry;

		var qix = new Qix(this._pathToQix);

		qix.query(envelope).then(
			
			function(ids) {

			},

			function() {

			}
		);
	}

};