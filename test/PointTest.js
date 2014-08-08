var tc = require('./testContext');

var context = tc.shpContext,
expect = tc.expect;

describe('Points', function() {

	describe('on points.shp', function() {

		function test(shp, done, index, expected) {

			shp.get(index, function(err, geometry) {
				expect(err).to.be.null;
				expect(geometry).not.to.be.null;

				expect(geometry.getX()).to.be.eq(expected[0]);
				expect(geometry.getY()).to.be.eq(expected[1]);

				done();
			});

		}

		context('points.shp', 'Reading 0-record', function(shp, done) {

			test(shp, done, 6, [-54.26961514497354, -7.161126332600625]);

		});

		context('points.shp', 'Reading 9-record', function(shp, done) {
			test(shp, done, 9, [-48.13926588712699, -21.116633393116544]);
		});
	});


});