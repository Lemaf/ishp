var Dbf = require('./lib/Dbf');
var Qix = require('./lib/Qix');
var Shp = require('./lib/Shp');
var Shx = require('./lib/Shx');
var step = require('step');
var jsts = require('jsts');
var path = require('path');


var ShapeFile = module.exports = function(fileName, jstsFactory) {

	this._baseName = path.normalize(fileName).replace(/\.shp$/i, '');

	this._jstsFactory = jstsFactory || new jsts.geom.GeometryFactory();
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

		var qix = new Qix(this._baseName + '.qix');

		var shp;
		if (options.geometry) {

			shp = new Shp(this._baseName + '.shp', this._jstsFactory, new Shx(this._baseName + '.shx'));
		}

		var dbf;
		if (options.data)
			dbf = new Dbf(this._baseName + '.dbf');


		var count = 0;
		qix.query(envelope, function(err, index) {
			console.log('\n\n\n----------------%s\n\n\n', index);
			if (!err) {
				if (index !== null) {
					count++;

					step(
						function() {
							if (shp)
								shp.get(index, this.parallel());
							
							if (dbf)
								dbf.get(index, this.parallel());
							else
								process.nextTick(this);
						},
						function(err, geometry, record) {
							count--;
							console.log('err=%s, geometry=%s, record=%s', err, geometry, record);


							if (err)
								console.log(err.stack);

							if (!count)
								callback(null, null);
						}
					);

				} else {
					if (!count)
						callback(null, null);
				}
			} else {
				callback(err, null);
			}
		});

	}

};