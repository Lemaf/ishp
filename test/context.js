var ShapeFile = require('../index').ShapeFile,
join = require('path').join;

module.exports = function context(fileName, description, fn) {


	it(description, function(done) {
		var shapeFile = new ShapeFile(join(__dirname, 'data', fileName));
		fn.call(this, shapeFile, done);
	});
};