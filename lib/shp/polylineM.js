var arrayInt32 = require('../BReader').LE.arrayInt32;

function load(buffer) {
	var numParts = buffer.readInt32LE(36);
	var numPoints = buffer.readInt32LE(40);

	if (numParts <= 0)
		throw new Error('Invalid number of parts');

	if (numPoints <= 0)
		throw new Error('Invalid number of points');

	var parts = arrayInt32(buffer, 44, numParts - 1);

	var offset = 44 + 4 * numParts, pointIndex = 0;

	var points = [], lines = [], mOffset = offset + 16 * numPoints;
	for (; numPoints; pointIndex++, numPoints--, offset += 8, mOffset += 8) {

		console.log('mOffset = %d @ %d', mOffset, buffer.length);
		points.push([
			buffer.readDoubleLE(offset),
			buffer.readDoubleLE(offset += 8),
			buffer.readDoubleLE(mOffset)
		]);

		if (pointIndex === parts[0]) {
			lines.push(points);
			points = [];
			parts.shift();
		}
	}
	lines.push(points);

	console.log(lines);
}

exports.load = load;