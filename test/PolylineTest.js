var tc = require('./util');

var context = tc.shapeFileContext,
expect = tc.expect;

function asc(a, b) { return a - b; }



describe('On lines.shp', function() {

	before(tc.download([
		{
			url: 'https://copy.com/Y0KcopGoEBmfrFuT/Public/lines.zip?download=1',
			name: 'lines',
			test: 'lines.shx'
		}
	]));

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