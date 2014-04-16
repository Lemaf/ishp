var expect = require('chai').expect;

var resolve = require('./util').resolve;
var download = require('./download');

var Shapefile = require('../ShapeFile');

describe('Shapefile', function() {

	var geometry;
	before(function() {

		var factory = new jsts.geom.GeometryFactory(jsts.geom.PrecisionModel.FLOATING);

		geometry = (new jsts.io.GeoJSONReader(factory)).read({
			type: 'Polygon',
			coordinates: [
				[
					[]
				]
			]
		});
	});

	describe('should', function() {

		it('ok', function() {

			expect(new Shapefile(resolve("data/br.sp.shp"))).to.exist;

		});

		it('throws a exception', function(done) {
			new Shapefile('not-found.shp').intersects(null).then(
				function() {

				},

				function(error) {
					done();
				}
			);
		});
	});

});