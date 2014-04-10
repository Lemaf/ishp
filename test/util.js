var path = require('path');

module.exports = {

	resolve: function(findPath) {
		return path.join(__dirname, findPath);
	}

};