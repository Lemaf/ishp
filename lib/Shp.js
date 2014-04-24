var Deferred = require('promised-io/promise').Deferred;
var fs = require('fs');
var jsts = require('jsts');

var CTypes = require('./CTypes');

var Shp = module.exports = function(fileName, factory, shx) {

	this._fileName = fileName;
	if (!factory)
			throw new TypeError('JSTS Geometry Factory needed!');

	if (!shx)
		throw new TypeError('SHX needed!');

	this._factory = factory;
	this._shx = shx;

	var deferred = new Deferred();
	this._fdP = deferred.promise;

	fs.open(fileName, 'r', function(err, fd) {
		if (!err)
			deferred.resolve(fd);
		else
			deferred.reject(err);
	});

};


Shp.prototype.get = function(index, callback) {

	var self = this;
	this._shx.get(index, function(err, shxRecord) {
		if (!err)
			self._load(shxRecord, callback);
		else
			callback(err, null);
	});
};

Shp.prototype._load = function(shxRecord, callback) {

	console.log('Record found %j', shxRecord);

	var self = this;

	this._fdP.then(
		function(fd) {
			fs.read(fd, new Buffer(shxRecord.length), 0, shxRecord.length, shxRecord.offset, function(err, bytesRead, buffer) {
				if (!err)
					self._process(bytesRead, buffer, callback);
				else
					callback(err, null);
			});
		},
		function(err) {
			callback(err, null);
		}
	);
};



Shp.prototype._process = function(bytesRead, buffer, callback) {
	if (bytesRead === buffer.length) {
		var type = buffer.readInt32LE(CTypes.INT32 + CTypes.INT32);

		console.log('Geometry Type %s', type);

		if (LOADERS[type]) {
			var geometry, err;
			try {
				geometry = LOADERS[type](buffer.slice(CTypes.INT32 * 3), this._factory);
			} catch (e) {
				err = e;
				console.log('%s, %s', e, e.stack);
			}

			if (geometry)
				callback(null, geometry);
			else
				callback(err, null);
		}
	} else {
		callback(new Error('Unexpected bytes length'), null);
	}
};


var LOADERS = {
	'5': function(buffer, jstsFactory) {
		var cursor = 0;
		var box = {
			xmin: buffer.readDoubleLE(cursor),
			ymin: buffer.readDoubleLE(cursor += CTypes.DOUBLE),
			xmax: buffer.readDoubleLE(cursor += CTypes.DOUBLE),
			ymax: buffer.readDoubleLE(cursor += CTypes.DOUBLE)
		};

		console.log('Geometry box = %j', box);
		var numParts = buffer.readInt32LE(cursor += CTypes.DOUBLE);
		var numPoints = buffer.readInt32LE(cursor += CTypes.INT32);
		cursor += CTypes.INT32;

		var parts = [];
		console.log('Geometry numParts = %s, numPoints = %s', numParts, numPoints);

		while (numParts--) {
			parts.push(buffer.readInt32LE(cursor));
			cursor += CTypes.INT32;
		}
		console.log('Geometry parts = %j', parts);

		var coordinates = [];
		var x,y, count = 0;
		var linearRings = [];

		while (numPoints--) {

			if (count === parts[0] && coordinates.length) {
				// starting a new ring

				linearRings.push(jstsFactory.createLinearRing(coordinates));
				coordinates.splice(0, coordinates.length);
				parts.shift();
			}

			x = buffer.readDoubleLE(cursor);
			y = buffer.readDoubleLE(cursor += CTypes.DOUBLE);
			cursor += CTypes.DOUBLE;

			//console.log("%s,%s", x, y);
			coordinates.push(new jsts.geom.Coordinate(x, y));
			count++;

		}

		linearRings.push(jstsFactory.createLinearRing(coordinates));

		var linearRing, shell, holes = [], polygons = [];

		for (count = 0; count < linearRings.length; count++) {
		
			linearRing = linearRings[count];
			if (jsts.algorithm.CGAlgorithms.isCCW(linearRing.getCoordinates())) {
				holes.push(linearRing);
			} else {
				if (shell)
					polygons.push(jstsFactory.createPolygon(shell, holes || []));

				shell = linearRing;
				holes = [];
			}
		}

		if (shell)
			polygons.push(jstsFactory.createPolygon(shell, holes || []));

		return new jsts.geom.MultiPolygon(polygons, jstsFactory);
	}
};