var FReader = module.exports = function(fd, fs) {
	this._fd = fd;
	this._position = 0;

	this._fs = fs || require('fs');
};


FReader.prototype.offset = function(offset, absolute) {

	if (!absolute)
		this._position += offset;
	else
		this._position = offset;

	return this;

};

FReader.prototype.read = function(length, buffer, offset, callback) {
	var self = this;

	if (!callback) {
		callback = buffer;
		buffer = new Buffer(length);
		offset = 0;
	}

/*	console.log({
		length: length,
		buffer: buffer,
		offset: offset,
		callback: callback,
		position: this._position
	});*/

	this._fs.read(this._fd, buffer, offset, length, this._position, function(err, bytesRead, buffer) {
		self._position += bytesRead;
		//console.log('FReader position = %s', self._position);
		callback(err, buffer.slice(0, bytesRead));
	});

	return this;
};