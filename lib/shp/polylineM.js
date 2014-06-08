var arrayInt32 = require('../BReader').LE.arrayInt32;

function load(buffer) {

	var box = {
		xmin: buffer.readDoubleLE(4),  //xmin
		ymin: buffer.readDoubleLE(12), //ymin
		xmax: buffer.readDoubleLE(20), //xmax
		ymax: buffer.readDoubleLE(28)  //ymax
	};

	var numParts = buffer.readInt32LE(36);
	var numPoints = buffer.readInt32LE(40);

	if (numParts <= 0)
		throw new Error('Invalid number of parts');

	if (numPoints <= 0)
		throw new Error('Invalid number of points');

	// 44-byte is always 0 or can it is different?
	var parts = arrayInt32(buffer, 45, numParts - 1);

	var offset = 44 + 4 * numParts, pointIndex = 0;

	var points = [], lines = [], mOffset = offset + 16 * numPoints;
	for (; numPoints; pointIndex++, numPoints--, offset += 8, mOffset += 8) {

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

	return {
		box: box,
		lines: lines
	};
}

exports.load = load;