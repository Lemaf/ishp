var fs = require('fs');

function FReader(fd, position) {
	this._fd = fd;
	this._position = position;
}

FReader.prototype.offset = function(offset, absolute) {
	if (absolute)
		this._position = offset;
	else
		this._position += offset;

	return this;
};

FReader.prototype.read = function(length, callback) {
	var self = this;

	fs.read(this._fd, new Buffer(length), 0, length, this._position, function(err, bytes, buffer) {
		self._position += bytes;
		if (err)
			callback(err);
		else {
			callback(null, bytes, buffer);
		}
	});

	return this;
};


module.exports = FReader;