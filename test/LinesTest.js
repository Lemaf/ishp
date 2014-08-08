var tc = require('./testContext');

var expect = tc.expect;


function context(file, description, fn) {

	var ShapeFile = require('../lib/ShapeFile');
	var path = require('path');
	process.chdir(path.join(__dirname, 'data'));

	var shapeFile = new ShapeFile(file);

	it(description, function(done) {

		fn.call(this, shapeFile, done);
	});

}

function asc(a, b) { return a - b; }



describe('On lines.shp', function() {

	context('lines.shp', 'Érico Cardoso / BA (-42.23482,-41.84175,-13.55158,-13.44922)', function(shapeFile, done) {
		var geometry = tc.factory.toGeometry(tc.factory.envelope(-42.23482,-41.84175,-13.55158,-13.44922));

		var spy,
		expectedAges = [44],
		foundAges = [];
		shapeFile.intersects(geometry, spy = tc.sinon.spy(tc.fix(function(err, feature) {
			if (spy.callCount >= 2) {
				expect(err).to.be.null;
				expect(feature).to.be.null;
				expect(foundAges.sort(asc)).to.be.eql(expectedAges);
				done();
			} else {
				expect(err).to.be.null;
				expect(feature).not.to.be.null;
				foundAges.push(feature.properties.age);
			}
		})));
	});

});