var path = require('path');

module.exports = {

	resolve: function(findPath) {
		return path.join(__dirname, findPath);
	},

	newEnvelope: function(xmin, xmax, ymin, ymax) {
		return new jsts.geom.Envelope(xmin, xmax, ymin, ymax);
	}

};