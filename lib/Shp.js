var ShpTypes = require('./ShpTypes');

var Promise = require('promise'),
NestedError = require('nested-error-stacks');

var format = require('util').format,
fs = require('fs');


function Shp(fileName, shx, jstsFactory) {
	this._shx = shx;
	this._jstsFactory = jstsFactory;
	var self = this;
	this._p = new Promise(function(resolve, reject) {
		shx._p.then(
			function() {
				fs.open(fileName, 'r', function(err, fd) {
					if (err)
						reject(err);
					else {
						self._fd = fd;
						fs.read(fd, new Buffer(100), 0, 100, 0, function(err, bytes, buffer) {
							if (err)
								reject(err);
							else {
								self._parseHead(bytes, buffer, resolve, reject);
							}
						});
					}
				});
			},
			function(err) {
				reject(new NestedError('In shx', err));
			}
		);
	});
}

Shp.prototype.get = function(index, callback) {
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

Shp.prototype._loadBytes = function(shxRecord, callback) {
	var self = this;
	shxRecord.bytes = shxRecord.length * 2 + 8;
	fs.read(this._fd, new Buffer(shxRecord.bytes), 0, shxRecord.bytes, shxRecord.offset, function(err, bytes, buffer) {
		if (err)
			callback(err);
		else {
			self._parseShape(shxRecord, bytes, buffer, callback);
		}
	});
};

Shp.prototype._get = function(index, callback) {
	var self = this;
	this._shx.get(index, function(err, record) {
		if (err)
			callback(err);
		else
			self._loadBytes(record, callback);
	});
};

Shp.prototype._parseHead = function(bytes, buffer, resolve, reject) {
	if (bytes !== 100)
		return reject(new Error('Invalid file length'));

	var header = {
		code: buffer.readInt32BE(0),
		fileLength: buffer.readInt32BE(24) * 2,
		shapeType: buffer.readInt32LE(32),
		version: buffer.readInt32LE(28)
	};

	if (header.code !== 9994)
		return reject(new Error('Invalid Shp file code'));

	if (header.fileLength <= 0)
		return reject(new Error('Invalid Shp file length'));

	if (header.version !== 1000)
		return reject(new Error('Invalid Shp file version'));

	/*if (!(header.shapeType in SUPPORTED_SHAPE_TYPES))
		return reject(new Error('Unsupported  Shape Type ' + header.shapeType));*/

	if (!(header.shapeType in ShpTypes))
		return reject(new Error(format('Unsupported Shape Type[%d]', header.shapeType)));


	this._heade = header;
	this._parse = ShpTypes[header.shapeType];

	resolve(header);
};

Shp.prototype._parseShape = function(shxRecord, bytes, buffer, callback) {
	if (bytes !== shxRecord.bytes) {
		return callback(new Error(format('Record read error[%d != %d]', bytes, shxRecord.bytes)));
	}

	var number = buffer.readInt32BE(0),
	length = buffer.readInt32BE(4);


	if (number !== shxRecord.index + 1)
		return callback(new Error('Shape record number is incorrect'));

	if (length !== shxRecord.length)
		return callback(new Error('Shape record length expected is different'));

	var geometry;
	try {
		geometry = this._parse(buffer.slice(8), this._jstsFactory);
	} catch (err) {
		return callback(new NestedError(format('Loading shape #%d error', shxRecord.index), err));
	}

	callback(null, geometry);
};

module.exports = Shp;