var expect = require('chai').expect;
var download = require('./download');
var ShapeFile = require('../ShapeFile');
var resolve = require('./util').resolve;
var newEnvelope = require('./util').newEnvelope;

var factory;

describe('Shapefile', function() {

	var geometry;

	this.timeout(0);

	before(function(done) {

		download(['https://copy.com/yzHc6aQO76ko/shp.js/br.sp.zip?download=1', 'https://copy.com/yzHc6aQO76ko/shp.js/br.mg.zip?download=1'], resolve('data'), true)
		.on('ready', function() {
			done();
		});

		factory = new jsts.geom.GeometryFactory(new jsts.geom.PrecisionModel(jsts.geom.PrecisionModel.FLOATING));

		geometry = (new jsts.io.GeoJSONReader(factory)).read({
			type: 'Polygon',
			coordinates: [
				[
					[]
				]
			]
		});
	});

	describe('br.mg.shp', function() {

		describe('should', function() {

			it('intersects Lavras/MG', function(done) {
				var envelope = newEnvelope(-45.19013,-44.91423,-21.14459,-21.01053);

				var shapefile = new ShapeFile(resolve('data/br.mg/br.mg.shp'));

				shapefile.intersects(factory.toGeometry(envelope), function(err, feature) {
					expect(err, 'Unexpected error').to.be.null;
					expect(feature, 'Feature').to.not.be.null;
					done();
				});
			});

		});
		
	});

});