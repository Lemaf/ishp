var tc = require('./testContext');
var expect = tc.expect;

function context(file, description, fn) {

	var ShapeFile = require('../lib/ShapeFile');

	var shapeFile = new ShapeFile(file);

	it(description, function(done) {

		fn.call(this, shapeFile, done);
	});

}

describe('On br.shp', function() {

	before(tc.download([
		{
			url: 'https://copy.com/yzHc6aQO76ko/shp.js/br.zip?download=1',
			name: 'br',
			test: 'br.shp'
		}
	]));



	describe('São João dos Patos / MA (-43.43312,-43.38103,-6.64456,-6.59436)', function() {

		context('br.shp', 'intersects', function(shapeFile, done) {

			this.timeout(1000);
			geometry = tc.factory.toGeometry(tc.factory.envelope(-43.43312,-43.38103,-6.64456,-6.59436));

			shapeFile.intersects(geometry, spy = tc.sinon.spy(tc.fix(function(err, result) {
				expect(err).to.be.null;
			})));

		});
		
	});

});