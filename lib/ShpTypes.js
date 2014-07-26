/*
	0: 'null',
	1: 'point',
	3: 'polyLine',
	5: 'polygon',
	8: 'multiPoint',
	25: 'polygonM'
*/

var BReader = require('./BReader');

function mkBboxXY(buffer, offset) {
	return {
		xmin: buffer.readDoubleLE(offset),
		ymin: buffer.readDoubleLE(offset + 8),
		xmax: buffer.readDoubleLE(offset + 16),
		ymax: buffer.readDoubleLE(offset + 24)
	};
}

function polylineXY(buffer, fn) {
	var bbox = mkBboxXY(buffer, 4);

	var numParts = buffer.readInt32LE(36),
	numPoints = buffer.readInt32LE(40);

	// TODO: check numParts and numPoints

	var partsIndexes = BReader.LE.arrayInt32(buffer, 44, numParts);
	partsIndexes.shift(); // always 0

	var x,y, line = [];

	for(var i=0, offset = 44 + 4 * numParts; i<numPoints; i++, offset += 8) {
		if (i === partsIndexes[0]) {
			line = [];
			partsIndexes.shift();
		}

		line.push([buffer.readDoubleLE(offset), buffer.readDoubleLE(offset += 8)]);
	}

	fn(line);
}

module.exports = {

	5: function polygon(buffer, jstsFactory) {
		polylineXY(buffer, function(line) {
			console.log(line);
		});

	},

	25: function polygonM(buffer, jstsFactory) {
		
	}

};
