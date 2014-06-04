var Promise = require('promise');

var fs = require('fs');

function Shx(fileName) {
	var self = this;
	this._p = new Promise(function(resolve, reject) {
		fs.open(fileName, 'r', function(err, fd) {
			if (err)
				reject(err);
			else {
				self._fd = fd;
				fs.read(fd, new Buffer(100), 0, 100, 0, function(err, bytes, buffer) {
					if (err)
						reject(err);
					else
						self._parseHeader(bytes, buffer, resolve, reject);
				});
			}
		});
	});
}

Shx.prototype._parseHeader = function(bytes, buffer, resolve, reject) {
	if (bytes !== 100)
		return reject(new Error('Invalid file length'));

	var header = {
		code: buffer.readInt32BE(0),
		fileLength: buffer.readInt32BE(24) * 2,
		version: buffer.readInt32LE(28),
		shapeType: buffer.readInt32LE(32)
	};

	if (header.code !== 9994)
		return reject(new Error('Invalid shx file code'));

	if (header.version !== 1000)
		return reject(new Error('Invalid shx version'));

	if (header.fileLength <= 0)
		return reject(new Error('Invalid shx file length'));

	this._header = header;

	resolve(header);
};



Shx.prototype.get = function(index, callback) {
	var self = this;
	this._p.then(
		function() {
			self._get(index, callback);
		},
		function(err) {
			callback(err);
		}
	);
};

Shx.prototype._get = function(index, callback) {
	var offset = 100 + index * 8;
	fs.read(this._fd, new Buffer(8), 0, 8, offset, function(err, bytes, buffer) {
		if (err)
			callback(err);
		else if (bytes !== 8)
			callback(new Error('Invalid record length'));
		else {
			callback(null, {
				index: index,
				offset: buffer.readInt32BE(0) * 2,
				length: buffer.readInt32BE(4)
			});
		}
	});
};

module.exports = Shx;