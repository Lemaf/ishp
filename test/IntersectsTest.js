var context = require('./context'),
download = require('./download'),
expect = require('chai').expect,
jsts = require('jsts');

var toGeometry = require('./JSTSFactory').toGeometry;


describe('ShapeFile', function() {

	before(download([
		{
			url: "https://copy.com/yzHc6aQO76ko/shp.js/br.sp.zip?download=1",
			name: "br.sp.zip",
			test: "br.sp.shp"
		}
	]));

	// Sertãozinho - SP - BR: -47.88684,-47.86040,-21.08315,-21.05238

	describe('intersects', function() {

		context('br.sp.shp', 'Sertãozinho', function(shapeFile, done) {
			var count = 2;
			var envelope = new jsts.geom.Envelope(-47.88684,-47.86040,-21.08315,-21.05238);
			shapeFile.intersects(toGeometry(envelope), function(err, feature) {
				if (err)
					throw err;

				if (!(--count)) {
					console.log(feature);
					done();
				}
			});
		});
	});

});