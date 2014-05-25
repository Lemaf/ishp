var fs = require('fs');
var Deferred = require('promised-io/promise').Deferred;

var Dbf = module.exports = function(fileName) {

	this._fileName = fileName;

	var deferred = new Deferred();

	this._promise = deferred.promise;

	var self = this;

	fs.open(fileName, 'r', function(err, fd) {
		if (!err) {
			self._fd = fd;

			fs.read(fd, new Buffer(32), 0, 32, null, function(err, bytesRead, buffer) {
				if (!err)
					try {
						self._loadHeader(fd, buffer, function(err) {

							console.log(self);
							if (!err)
								deferred.resolve(fd);
							else
								deferred.reject(err);
						});
					} catch (e) {
						deferred.reject(e);
					}
				else
					deferred.reject(err);
			});

		} else
			deferred.reject(fd);
	});
};

Dbf.prototype.get = function(index, callback) {

	var self = this, recordLength = this._recordLength;
	this._promise.then(
		function(fd) {
			fs.read(fd, new Buffer(recordLength), 0, recordLength, index * recordLength + self._dataStart, function(err, bytes, buffer) {
				if (!err)
					self._get(index, bytes, buffer, callback);
				else
					callback(err, null);
			});
		},
		function(err) {
			callback(err, null);
		}
	);

};

Dbf.prototype._get = function(index, bytes, buffer, callback) {
	var record, err;
	try {
		record = this._header.fields.reduce(function(obj, field) {
			obj[field.name] = field.extractor(buffer.slice(field.start, field.end), field);
			return obj;
		}, {});
	} catch (e) {
		err = e;
	}

	console.log(record);

	if (!err)
		callback(err, null);
	else
		callback(null, record);
};


Dbf.prototype._loadHeader = function(fd, buffer, done) {

	if (buffer.length !== 32)
		throw new RangeError('Invalid header length');

	var fields = [];

	this._header = {
		version: buffer.readUInt8(0),
		numRecords: buffer.readUInt32LE(4),
		headerLength: buffer.readUInt16LE(8),
		recordLength: buffer.readUInt16LE(10),
		fields: fields
	};

	var self = this;
	buffer = new Buffer(33);

	console.log(this._header);

	var cursor = 32, field, fStart = 0;
	var fieldProcessor = function(err, bytes, buffer) {
		if (!err) {
			fields.push(field = {
				name: buffer.toString('ascii', 0, 10).replace(/\u0000/g, ''),
				type: buffer.toString('ascii', 11, 12),
				length: buffer.readUInt8(16),
				dCount: buffer.readInt8(17)
			});

			field.start = fStart;
			field.end = fStart + field.length;
			fStart = fStart + field.length;



			field.extractor = EXTRACTORS[field.type];
			console.log(field);
			if (!field.extractor)
				return done(new TypeError('Unsupported DBF Type ' + field.type));

			if (buffer[32] !== 0x0D) {
				try {
					fs.read(fd, buffer, 0, 33, cursor += 32, fieldProcessor);
				} catch (e) {
					done(e);
				}
			} else {
				self._dataStart = self._header.headerLength + 1;
				self._recordLength = self._header.recordLength;
				done();
			}

		} else {
			done(err);
		}
	};

	fs.read(fd, buffer, 0, 33, cursor, fieldProcessor);
};

var EXTRACTORS = {
	'C': function(buffer, field) {
		return buffer.toString('ascii');
	},

	'N': function(buffer, field) {
		return +buffer.toString('ascii');
	}
};