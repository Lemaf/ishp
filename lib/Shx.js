var fs = require('promised-io/fs');
var CTypes = require('./CTypes');

var RECORD_LENGTH = CTypes.INT32 * 2;
var Shp = module.exports = function(fileName) {
	this._fileName = fileName;

	this._fdPromise = fs.open(this._fileName, 'r').then(
		function(fd) {
			this._fd = fd;
		}.bind(this)
	);

};

Shp.prototype.get = function(offset, callback) {

	var self = this;
	this._file.then(
		function() {

			offset = 100 + offset * RECORD_LENGTH;

			fs.read(self._fd, new Buffer(RECORD_LENGTH), 0, RECORD_LENGTH, offset, function(err, bytesRead, buffer) {
				if (!err) {
					callback(null, {
						offset: buffer.readInt32BE(0) * 2,
						length: buffer.readInt32BE(CTypes.INT32)
					});
				} else {
					callback(err, null);
				}
			});
		},

		function(err) {
			callback(err, null);
		}
	);
};