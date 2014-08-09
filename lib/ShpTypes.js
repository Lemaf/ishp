/*
	0: 'null',
	1: 'point',
	3: 'polyLine',
	5: 'polygon',
	8: 'multiPoint',
	25: 'polygonM'
*/

var BReader = require('./BReader');
var jsts = require('jsts');


var isCCW = jsts.algorithm.CGAlgorithms.isCCW;

function mkEnvelope(buffer, offset) {
	return new jsts.geom.Envelope(
		buffer.readDoubleLE(offset),
		buffer.readDoubleLE(offset + 16),
		buffer.readDoubleLE(offset + 8),
		buffer.readDoubleLE(offset + 24)
	);
}

function coordinatesXY(buffer, fn) {

	var numParts = buffer.readInt32LE(36),
	numPoints = buffer.readInt32LE(40);

	// TODO: check numParts and numPoints

	var partsIndexes = BReader.LE.arrayInt32(buffer, 44, numParts);
	partsIndexes.shift(); // always 0

	var x,y, line = [];

	for(var i=0, offset = 44 + 4 * numParts; i<numPoints; i++, offset += 8) {
		if (i === partsIndexes[0]) {
			fn(line);
			line = [];
			partsIndexes.shift();
		}

		x = buffer.readDoubleLE(offset);
		y = buffer.readDoubleLE(offset += 8);

		line.push(new jsts.geom.Coordinate(x, y));
	}

	fn(line);
}

module.exports = {

	1: function point(buffer, jstsFactory) {
		return jstsFactory.createPoint(
			new jsts.geom.Coordinate(buffer.readDoubleLE(4), buffer.readDoubleLE(12))
		);
	},

	3: function polyline(buffer, jstsFactory) {

		var lines = [];
		coordinatesXY(buffer, function(coordinates) {
			lines.push(jstsFactory.createLineString(coordinates));
		});

		var multiLineString = new jsts.geom.MultiLineString(lines, jstsFactory);
		multiLineString.envelope = mkEnvelope(buffer, 4);

		return multiLineString;
	},

	5: function polygon(buffer, jstsFactory) {
		var shell, holes = [], polygons = [];

		coordinatesXY(buffer, function(coordinates) {
			if (isCCW(coordinates)) {
				// hole...
				holes.push(jstsFactory.createLinearRing(coordinates));
			} else {
				// shell...
				if (shell)
					polygons.push(jstsFactory.createPolygon(shell, holes));

				shell = jstsFactory.createLinearRing(coordinates);
				holes = [];
			}

		});

		if (shell)
			polygons.push(jstsFactory.createPolygon(shell, holes));

		var multiPolygon = new jsts.geom.MultiPolygon(polygons, jstsFactory);
		multiPolygon.envelope = mkEnvelope(buffer, 4);

		return multiPolygon;
	},

	8: function multiPoint(buffer, jstsFactory) {
		var numPoints = buffer.readInt32LE(36);

		if (numPoints >= 0) {
			var points = new Array(numPoints);

			for (var i=0, offset=40; numPoints; numPoints--, i++, offset+=8)
				points[i] = jstsFactory.createPoint(
					new jsts.geom.Coordinate(buffer.readDoubleLE(offset), buffer.readDoubleLE(offset += 8))
				);

			var multiPoints = new jsts.geom.MultiPoint(points, jstsFactory);
			multiPoints.envelope = mkEnvelope(buffer, 4);

			return multiPoints;
		} else {
			throw new RangeError('Invalid NumPoints');
		}
	}

};