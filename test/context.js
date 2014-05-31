var ShapeFile = require('../index').ShapeFile,
join = require('path').join;

module.exports = function context(fileName, description, fn) {

	var self = this;

	it(description, function(done) {
		var shapeFile = new ShapeFile(join(__dirname, 'data', fileName));
		fn.call(self, shapeFile, done);
	});
};
