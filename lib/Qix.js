var format = require('util').format,
fs = require('fs')
;
var Promise = require('promise');

var BReader = require('./BReader');
var CallbackContext = require('./CallbackContext');
var FReader = require('./FReader');

var HEADER_LENGTH = 16;
var NODE_FIXED_LENGTH = 4 + 4 * 8 + 4;


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
							self._fd = fd;
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

	var self = this;

	this._p.then(
		function() {
			try {
				self._query(envelope, callback);
			} catch (e) {
				console.log(e.stack);
			}
		},
		function(err) {
			callback(err);
		}
	);

};

Qix.prototype._query = function(envelope, callback) {
	var fReader = new FReader(this._fd, HEADER_LENGTH);

	var context = {
		bReader: this._bReader,
		callback: function(index) {
			callback(null, index);
		},
		error: function(err) {
			try {
				callback(err);
			} catch (e) {
				//console.error(e.stack);
			}
		},
		envelope: envelope,
		fReader: fReader
	};

	fReader.read(NODE_FIXED_LENGTH, function(err, bytes, buffer) {
		if (err)
			callback(err);
		else
			visit(context, bytes, buffer, function() {
				callback(null, null);
			});
	});
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
	
	if (header.signature !== 'SQT')
		throw new Error(format('Invalid Signature[%s]', header.signature));

	var bReader;
	switch (header.bOrder) {
	case 0:
		bReader = os.endianness() === 'LE' ? BReader.LE : BReader.BE;
		break;
	case 1:
		bReader = BReader.LE;
		break;
	case 2:
		bReader = BReader.BE;
		break;
	default:
		throw new RangeError(format('Invalid Byte Order[%d]', header.bOrder));
	}

	header.numShapes = bReader.int32(buffer,8);
	header.maxDepth = bReader.int32(buffer, 12);

	if (header.numShapes <= 0 || header.numShapes > 0xFFFFFFFF)
		throw new RangeError(format('Invalid Number of Shapes[%d]', header.numShapes));

	if (header.maxDepth < 0 || header.maxDepth > 0xFFFFFFFF)
		throw new RangeError(format('Invalid Max Depth[%d]', header.maxDepth));

	//console.log(header);
	return {header: header, reader: bReader};
}


function visit(context, bytes, buffer, done) {
	if (bytes !== NODE_FIXED_LENGTH)
		context.error(new RangeError('Invalid node length'));
	else {
		var numShapes = context.bReader.int32(buffer, 36);
		if (numShapes < 0) {
			//console.log(buffer.slice(36, 40));
			return context.error(new RangeError(format('Invalid Node Number of Shapes[%d]', numShapes)));
		}

		var nodeEnvelope = new jsts.geom.Envelope(
			context.bReader.double(buffer, 4),
			context.bReader.double(buffer, 20),
			context.bReader.double(buffer, 12),
			context.bReader.double(buffer, 28)
		);

		if (context.envelope.intersectsEnvelope(nodeEnvelope)) {
			var childreen;

			var undeep = function(err, bytes, buffer) {
				if (err) {
					context.error(err);
				} else if (buffer) {
						visit(context, bytes, buffer, undeep);
				} else if (--childreen) {
						context.fReader.read(NODE_FIXED_LENGTH, undeep);
				} else {
					done();
				}
			};

			context.fReader.read(numShapes * 4 + 4, function(err, bytes, buffer) {
				if ((numShapes * 4 + 4) !== bytes) {
					context.error(new Error('Dive error') );
				} else {
					for (var p=0; numShapes; numShapes--, p+= 4) {
						context.callback(context.bReader.int32(buffer, p));
					}

					childreen = context.bReader.int32(buffer, bytes - 4);
					if (childreen > 0)
						context.fReader.read(NODE_FIXED_LENGTH, undeep);
					else if (childreen === 0)
						done();
					else
						context.error(new RangeError('Invalid childreen count'));
				}
			});
		} else {
			var offset = context.bReader.int32(buffer, 0);
			// console.log('Jump, offset=%d, numShapes=%d', offset, numShapes);
			// jump childreen nodes and current node
			context.fReader.offset(offset + numShapes * 4 + 4);
			done();
		}
	}
}


module.exports = Qix;