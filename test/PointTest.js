var tc = require('./util');

var context = tc.shpContext,
expect = tc.expect;

describe('Points', function() {

	before(tc.download([
		{
			url: 'https://copy.com/yzHc6aQO76ko/shp.js/points.zip?download=1',
			name: 'points',
			test: 'points.shp'
		},
		{
			url: 'https://copy.com/yzHc6aQO76ko/shp.js/multipoint.zip?download=1',
			name: 'multipoint',
			test: 'multipoint.shp'
		}
	]));

	describe('on points.shp', function() {

		function test(shp, done, index, expected) {

			shp.get(index, function(err, geometry) {
				process.nextTick(function() {
					expect(err).to.be.null;
					expect(geometry).not.to.be.null;

					if (geometry.CLASS_NAME === 'jsts.geom.MultiPoint') {
						var point;
						for (var i=0; i<geometry.getNumGeometries(); i++) {
							point = geometry.getGeometryN(i);
							expect(point.getX()).to.be.eq(expected[i][0]);
							expect(point.getY()).to.be.eq(expected[i][1]);
						}

					} else {
						expect(geometry.getX()).to.be.eq(expected[0]);
						expect(geometry.getY()).to.be.eq(expected[1]);
					}

					done();
				});
			});

		}

		context('points.shp', 'Reading 0-record', function(shp, done) {
			test(shp, done, 6, [-54.26961514497354, -7.161126332600625]);
		});

		context('points.shp', 'Reading 9-record', function(shp, done) {
			test(shp, done, 9, [-48.13926588712699, -21.116633393116544]);
		});

		context('multipoint.shp', 'Reading 42-record', function(shp, done) {
			test(shp, done, 42, [[435571.28000000002793968, 135412.11999999999534339]]);
		});

		context('multipoint.shp', 'Reading 304-record', function(shp, done) {
			test(shp, done, 304, [[435164.60999999998603016, 134769.42000000001280569]]);
		});
	});


});