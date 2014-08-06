var tc = require('./testContext');

var expect = tc.expect;

var Qix = require('../lib/Qix');


function context(file, description, fn) {
	it(description, function(done) {
		var qix = new Qix(file);

		fn.call(this, qix, done);
	});
}

describe('Qix', function() {

	before(tc.download([
		{
			url: 'https://copy.com/yzHc6aQO76ko/shp.js/br.sp.zip?download=1',
			test: 'br.sp.shp',
			name: 'br.sp'
		}
	]));

	context('br.sp.qix', 'teste', function(qix, done) {

		this.timeout(0);
		var spy;
		qix.query(tc.factory.envelope(-48.01596,-47.95535,-21.14624,-21.09490), spy = tc.sinon.spy(tc.fix(function(err, index) {

			console.log('callCount = %d, index=%d', spy.callCount, index);

			if (spy.callCount >= 13) {
				done();
			} else {
				expect(err).to.be.null;
				expect(index).to.be.gt(0);
			}
		})));
	});

});