var BReader = require('./BReader');
var fs = require('fs');
var Promise = require('promise');

var HEADER_LENGTH = 3 + 1 + 1 + 3 + 2 * 4;


function Qix(fileName) {

	var self = this;
	this._fileName = fileName;
	
	this._p = new Promise(function(resolve, reject) {
		fs.open(fileName, 'r', function(err, fd) {
			if (err)
				reject(err);
			else
				fs.read(fd, new Buffer(HEADER_LENGTH), 0, HEADER_LENGTH, 0, function(err, bytes, buffer) {
					if (err)
						reject(err);
					else {
						try {
							var parsed = parseHeader(bytes, buffer);
							self._header = parsed.header;
							self._bReader = parsed.reader;
							resolve(fd);
						} catch (e) {
							reject(e);
						}
					}
				});
		});
	});

}

Qix.prototype.query = function(envelope, callback) {

};

function parseHeader(bytes, buffer) {

	if (bytes !== HEADER_LENGTH)
		throw new Error('Unexpected file length');

	var header = {
		signature: buffer.toString('ascii', 0, 3),
		bOrder: buffer.readInt8(3),
		version: buffer.readInt8(4),
		flags: [
			buffer.readInt8(5), buffer.readInt8(6), buffer.readInt8(7)
		]
	};

	var bReader;
	switch (header.bOrder) {
	case 1:
		bReader = BReader.LE;
		break;
	case 2:
		bReader = BReader.BE;
		break;
	default:
		throw new Error('Invalid Byte Order');
	}

	header.numShapes = bReader.int32(buffer,8);
	header.maxDepth = bReader.int32(buffer, 12);

	if (header.numShapes <= 0 || header.numShapes > 0xFFFFFFFF)
		throw new Error('Invalid numShapes');

	// 50 is magic
	if (header.maxDepth < 1 || header.maxDepth > 50)
		throw new Error('Invalid max depth');

	return {header: header, reader: bReader};
}


module.exports = Qix;