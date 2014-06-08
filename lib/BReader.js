// Buffer Reader helper

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
		},

		arrayInt32: function(buffer, offset, length) {
			var array = new Array(length);
			for (var i=0; i<length; i++, offset += 4) {
				array[i] = buffer.readInt32LE(offset);
			}
			return array;
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