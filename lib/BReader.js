function int8(buffer, offset) {
	return buffer.readInt8(offset);
}

module.exports = {
	LE: {
		int8: int8,
		int32: function(buffer, offset) {
			return buffer.readInt32LE(offset);
		},
		double: function(buffer, offset) {
			return buffer.readDoubleLE(offset);
		}
	},

	BE: {
		int8: int8,
		int32: function(buffer, offset) {
			return buffer.readInt32BE(offset);
		},
		double: function(buffer, offset) {
			return buffer.readDoubleBE(offset);
		}
	}
};