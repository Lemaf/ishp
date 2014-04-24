var fs = require('promised-io/fs');
var CTypes = require('./CTypes');

var RECORD_LENGTH = CTypes.INT32 * 2;
var Shp = module.exports = function(fileName) {
	this._fileName = fileName;

	this._fd = fs.open(this._fileName, 'r');
};

Shp.prototype.get = function(index, callback) {

	var self = this;
	var offset = 100 + index * RECORD_LENGTH;

	var promise = fs.read(this._fd, new Buffer(RECORD_LENGTH), 0, RECORD_LENGTH, offset);
	promise.then(
		function(args) {
			// Is this correct?
			var buffer = args[1];

			callback(null, {
				index: index,
				offset: buffer.readInt32BE(0) * 2,
				length: buffer.readInt32BE(CTypes.INT32) * 2 +  CTypes.INT32 * 2
			});
		},
		function(args) {
			console.log('Error????');
			callback(args[0] || args, null);
		}
	);


	/*this._file.then(
		function() {

			offset = 100 + offset * RECORD_LENGTH;

			fs.read(self._file, new Buffer(RECORD_LENGTH), 0, RECORD_LENGTH, offset).then(
				function(bytesRead, buffer) {
					console.log(arguments);
					callback(null, {
						offset: buffer.readInt32BE(0) * 2,
						length: buffer.readInt32BE(CTypes.INT32)
					});
				},
				function(err) {
					callback(err, null);
				}
			);
		},
		function(err) {
			callback(err, null);
		}
	);*/
};