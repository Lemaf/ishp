// Buffer Reader helper

function int8(buffer, offset) {
	return buffer.readInt8(offset);
}

module.exports = {
	LE: {
		arrayInt32: function(buffer, offset, length) {
			var array = new Array(length);
			for (var i=0; i<length; i++, offset += 4) {
				array[i] = buffer.readInt32LE(offset);
			}
			return array;
		},
		int8: int8,
		double: function(buffer, offset) {
			return buffer.readDoubleLE(offset);
		},
		int32: function(buffer, offset) {
			return buffer.readInt32LE(offset);
		}
	},

	BE: {
		int32: function(buffer, offset) {
			return buffer.readInt32BE(offset);
		},
		int8: int8,
		double: function(buffer, offset) {
			return buffer.readDoubleBE(offset);
		}
	}
};