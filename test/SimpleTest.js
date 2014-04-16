var expect = require('chai').expect;

var resolve = require('./util').resolve;
var download = require('./download');

var Shapefile = require('../ShapeFile');

describe('Shapefile', function() {

	var geometry;

	this.timeout(0);

	before(function(done) {

		download(['https://copy.com/yzHc6aQO76ko/shp.js/br.sp.zip?download=1', 'https://copy.com/yzHc6aQO76ko/shp.js/br.mg.zip?download=1'], resolve('data'), true)
		.on('ready', function() {
			done();
		});

		var factory = new jsts.geom.GeometryFactory(new jsts.geom.PrecisionModel(jsts.geom.PrecisionModel.FLOATING));

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