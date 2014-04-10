var expect = require('chai').expect;

var resolve = require('./util').resolve;

var Shapefile = require('../index');

describe('Shapefile', function() {

	describe('should', function() {

		it('ok', function() {

			expect(new Shapefile(resolve("data/br.sp.shp"))).to.exist;

		});

		it('throws a exception', function(done) {
			new Shapefile('not-found.shp').query(null).then(
				function() {

				},

				function(error) {
					done();
				}
			);
		});
	});

});