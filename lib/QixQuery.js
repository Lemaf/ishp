var FReader = require('./FReader');
var CTypes = require('./CTypes');
var step = require('step');


var NODE_PRE = CTypes.INT32 * 2 + CTypes.DOUBLE * 4;
var QixQuery = module.exports = function(config, envelope, callback) {
	this._envelope = envelope;
	this._callback = callback;

	this._fd = config.fd;
	this._le = config.le;
	this._reader = new FReader(this._fd).offset(16);

	var self = this;

	this._reader.read(NODE_PRE, function(err, buffer) {
		self._visitNode(err, buffer);
	});

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

QixQuery.prototype._visitNode = function(err, buffer) {
	if (!err) {
		if (buffer.length === NODE_PRE) {
			var rect = this._rectOfNode(buffer);
			console.log(rect);

			if (this._overlaps(rect)) {
				// dive
				console.log('dive');

				var self = this;
				var numShapes = (this._le) ? buffer.readInt32LE(36) : buffer.readInt32BE(36);

				step (
					function() {
						if (numShapes > 0)
							self._reader.read(numShapes * CTypes.INT32, this);
						else
							return null;
					},

					function(err, buffer) {
						if (err)
							throw err;

						if (buffer) {
							// shapes...
							for (var i=0, p = 0; i<numShapes; i++, p+=4) {
								self._callback(
										null,
										(self._le) ? buffer.readInt32LE(p) : buffer.readInt32BE(p)
								);
							}
						}

						self._reader.read(CTypes.INT32, this);
					},

					function(err, buffer) {

						if (err)
							throw err;

						var numSubNodes = (self._le) ? buffer.readInt32LE(0) : buffer.readInt32BE(0);

						var next = function(err, buffer) {
							if (numSubNodes--)
								self._reader.read(NODE_PRE, next);
							
							if (buffer)
								self._visitNode(err, buffer);
						};

						return next();
					}
				);

			} else {
				// jump
				console.log('jump');
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