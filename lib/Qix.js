var CTypes = require('./CTypes');
var Deferred = require('promised-io/promise').Deferred;

var fs = require('fs');
var Query = require('./QixQuery');

var HEADER_LENGTH = CTypes.CHAR * 8 + CTypes.INT32 * 2;

var Qix = module.exports = function(fileName) {
	this._fileName = fileName;

	var self = this;
	this._disktreeDeferred = new Deferred();
	this._disktreePromise = this._disktreeDeferred.promise;

	fs.open(this._fileName, 'r', function(err, fd) {
		if (!err)
			fs.read(fd, new Buffer(HEADER_LENGTH), 0, HEADER_LENGTH, null, function(err, bytesRead, buffer) {
				try {
					self._load(err, fd, bytesRead, buffer);
				} catch (e) {
					self._disktreeDeferred.reject(e);
				}
			});
		else
			self._disktreeDeferred.reject(err);
	});
};

var LSB_ORDER = 1, MSB_ORDER = 2;

/**
	Search indexes intersects with envelope
*/
Qix.prototype.query = function(envelope, callback) {

	var self = this;
	this._disktreePromise.then(
		function() {
			return self._query(envelope, callback);
		},

		function(err) {
			callback(err, null);
		}
	);

};


Qix.prototype._load = function(err, fd, bytesRead, buffer) {
	if (err)
		return this._disktreeDeferred.reject(err);

	if (bytesRead !== HEADER_LENGTH)
		return this._disktreeDeferred.reject(new Error('Invalid index file size!'));

	if (buffer.toString('ascii', 0, 3) !== 'SQT')
		return this._disktreeDeferred.reject(new Error('Invalid signature!'));

	this._le = buffer.readInt8(3) === LSB_ORDER;

	if (this._le){
		this._numShapes = buffer.readInt32LE(8);
		this._maxDepth = buffer.readInt32LE(12);
	} else {
		this._numShapes = buffer.readInt32BE(8);
		this._maxDepth = buffer.readInt32BE(12);
	}

	this._fd = fd;
	this._disktreeDeferred.resolve(this._fd);
};

/**
	Effective query
	@private
*/
Qix.prototype._query = function(envelope, callback) {
	new Query({
		fd: this._fd,
		le: this._le
	},  envelope, callback).apply();
};

