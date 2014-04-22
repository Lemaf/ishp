var FReader = require('./FReader');
var CTypes = require('./CTypes');
var step = require('step');


var NODE_FIXED_LENGTH = CTypes.INT32 * 2 + CTypes.DOUBLE * 4;

var QixQuery = module.exports = function(config, envelope, callback) {
	this._envelope = envelope;
	this._callback = callback;

	this._fd = config.fd;
	this._le = config.le;
	this._reader = new FReader(this._fd).offset(16);

	var self = this;

	this._reader.read(NODE_FIXED_LENGTH, function(err, buffer) {
		self._visitNode(err, buffer);
	});

};


QixQuery.prototype._dispatchIndexes = function(buffer) {
	var self = this;
	var tick = function(index) {
		return function() {
			self._callback(null, index);
		};
	};

	for (var i=0; i<buffer.length; i += CTypes.INT32)
		process.nextTick(tick((this._le) ? buffer.readInt32LE(i) : buffer.readDoubleBE(i)));
};

QixQuery.prototype._overlaps = function(rect) {
	if (rect.maxx < this._envelope.maxx)
		return false;
	if (rect.minx > this._envelope.maxx)
		return false;
	if (rect.maxy < this._envelope.miny)
		return false;
	if (rect.miny > this._envelope.maxy)
		return false;

	return true;
};

QixQuery.prototype._visitNode = function(err, buffer, done) {
	if (!err) {

		if (buffer.length === NODE_FIXED_LENGTH) {
			var rect = this._rectOfNode(buffer);
			console.log('overlaps %j', rect);

			var numShapes = (this._le) ? buffer.readInt32LE(36) : buffer.readInt32BE(36);
			console.log('numShapes %s', numShapes);

			if (this._overlaps(rect)) {
				// dive
				console.log('dive');

				var self = this;

				var next = function() {
					self._reader.read(CTypes.INT32, function(err, buffer) {
						var numSubNodes = (self._le) ? buffer.readInt32LE(0) : buffer.readInt32BE(0);

						var nextSubNode = function(err, buffer) {
							if (!err) {

								if (buffer)
									return self._visitNode(err, buffer, nextSubNode);
								
								if (numSubNodes) {
									numSubNodes--;
									self._reader.read(NODE_FIXED_LENGTH, nextSubNode);
								} else if (done)
									done();
							}
						};

						nextSubNode();
					});
				};

				if (numShapes > 0) {
					this._reader.read(numShapes * CTypes.INT32, function(err, buffer) {
						if (!err) {
							self._dispatchIndexes(buffer);
							next();
						} else
							self._callback(err, null);

					});
				} else
					next();

			} else {
				// jump
				console.log('jump');
				var offset = (this._le) ? buffer.readInt32LE(0) : buffer.readInt32BE(0);
				offset += numShapes * CTypes.INT32 + CTypes.INT32;
				this._reader.offset(offset);
				if (done)
					done();
			}
		} else {
			this._callback(new Error('Invalid node pre length'), null);
		}
	} else
		this._callback(err, null);
};

QixQuery.prototype._rectOfNode = function(buffer) {
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