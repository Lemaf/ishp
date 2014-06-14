var context = require('./context'),
download = require('./download'),
expect = require('chai').expect,
join = require('path').join,
jsts = require('jsts');

var Qix = require('../lib/Qix');


describe('Qix', function() {

	describe('br.shp', function() {

		before(download([
			{
				url: 'https://copy.com/yzHc6aQO76ko/shp.js/br.zip?download=1',
				name: 'br.zip',
				test: 'br.qix'
			}
		]));

		var qix;
		before(function() {
			qix = new Qix(join(__dirname, 'data', 'br.qix'));
		});


		// -42.16625, -42.04059,-13.56737,-13.38247
		it('should find Érico Cardoso - BA', function(done) {
			var total = 2, count=0;
			qix.query(new jsts.geom.Envelope(-42.16625, -42.04059,-13.56737,-13.38247), function(err, index) {
				if (++count >= total) {
					done();
				}

				console.log(count);
			});
		});

	});
});