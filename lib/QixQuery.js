var FReader = require('./FReader');
var CTypes = require('./CTypes');
var step = require('step');


var NODE_PRE_LENGTH = CTypes.INT32 * 2 + CTypes.DOUBLE * 4;

var QixQuery = module.exports = function(config, envelope, callback) {
	this._envelope = envelope;
	this._callback_ = callback;

	this._fd = config.fd;
	this._le = config.le;

	var self = this;
};


QixQuery.prototype._overlaps = function(rect) {
	if (rect.maxx < this._envelope.minx)
		return false;
	if (rect.minx > this._envelope.maxx)
		return false;
	if (rect.maxy < this._envelope.miny)
		return false;
	if (rect.miny > this._envelope.maxy)
		return false;

	return true;
};

QixQuery.prototype.apply = function() {
	if (this._file)
		return;

	var self = this;
	this._file = new FReader(this._fd).offset(16);

	this._file.read(NODE_PRE_LENGTH, function(err, buffer) {
		self._search(err, buffer, function() {
			self._callback(null, null);
		});
	});
};

QixQuery.prototype._callback = function(err, index) {
	if (!this._err) {
		if (!err)
			this._callback_(null, index);
		else {
			this._err = err;
			this._callback_(err, null);
		}
	}

	if (err)
		console.log('QixQuery callback error %s', err);
};

QixQuery.prototype._dispatch = function(indexesBuffer) {
	for (var i = 0, index; i<indexesBuffer.length; i+=CTypes.INT32) {
		index = (this._le) ? indexesBuffer.readInt32LE(i) : indexesBuffer.readInt32BE(i);
		this._callback(null, index);
	}
};

QixQuery.prototype._numShapesOf = function(buffer) {
	return this._le ? buffer.readInt32LE(36) : buffer.readInt32BE(36);
};

QixQuery.prototype._rectOf = function(buffer) {
	var minx, miny, maxx, maxy;

	if (this._le) {
		minx = buffer.readDoubleLE(4);
		miny = buffer.readDoubleLE(12);
		maxx = buffer.readDoubleLE(20);
		maxy = buffer.readDoubleLE(28);
	} else {
		minx = buffer.readDoubleBE(4);
		miny = buffer.readDoubleBE(12);
		maxx = buffer.readDoubleBE(20);
		maxy = buffer.readDoubleBE(28);
	}

	return {
		minx: minx, miny: miny, maxx: maxx, maxy: maxy
	};
};

QixQuery.prototype._search = function(nodeErr, nodeBuffer, done) {

	if (!nodeErr) {
		var self = this;
		var rect = this._rectOf(nodeBuffer);
		var numShapes = this._numShapesOf(nodeBuffer);

		if (this._overlaps(rect)) {
			console.log('dive %j', rect);

			this._file.read(numShapes * CTypes.INT32 + CTypes.INT32, function(err, buffer) {
				if (numShapes > 0)
					self._dispatch(buffer.slice(0, -CTypes.INT32));

				var numSubNodes = (self._le) ? buffer.readInt32LE(buffer.length - CTypes.INT32) : buffer.readInt32BE(buffer.length - CTypes.INT32);

				console.log('numSubNodes %s', numSubNodes);

				var dive = function(subNodeErr, subNodeBuffer) {
					console.log('dive in %s', numSubNodes);
					if (!subNodeErr) {

						if (subNodeBuffer) {
							self._search(null, subNodeBuffer, dive);
						} else {
							if (numSubNodes) {
								numSubNodes--;
								self._file.read(NODE_PRE_LENGTH, dive);
							} else {
								done();
							}
						}

					} else {
						done(subNodeErr);
					}
				};

				if (numSubNodes) {
					numSubNodes--;
					self._file.read(NODE_PRE_LENGTH, dive);
				} else
					done();
			});

		} else {
			console.log('jump %j', rect);
			var offset = (this._le) ? nodeBuffer.readInt32LE(0) : nodeBuffer.readInt32BE(0);
			offset += numShapes * CTypes.INT32 + CTypes.INT32;

			this._file.offset(offset);
			done();
		}
	} else {
		this._callback(nodeErr);
	}

};