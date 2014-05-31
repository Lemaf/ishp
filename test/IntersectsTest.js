var download = require('./download'),
context = require('./context');


describe('ShapeFile', function() {

	before(download([
		{
			url: "https://copy.com/yzHc6aQO76ko/shp.js/br.sp.zip?download=1",
			name: "br.sp.zip",
			test: "br.sp.shp"
		}
	]));

	describe('intersects', function() {

		context('br.sp.shp', 'Sertãozinho', function(shapeFile, done) {

			done();
		});
	});

});