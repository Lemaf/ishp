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
		}, {
			url: 'https://copy.com/yzHc6aQO76ko/shp.js/br.zip?download=1',
			test: 'br.shp',
			name: 'br'
		}
	]));

	context('br.sp.qix', 'teste', function(qix, done) {

		this.timeout(0);
		var spy, indexes = [];
		qix.query(tc.factory.envelope(-48.01596,-47.95535,-21.14624,-21.09490), spy = tc.sinon.spy(tc.fix(function(err, index) {

			/*console.log('callCount = %d, index=%d', spy.callCount, index);*/

			if (spy.callCount >= 13) {
				done();
			} else {
				expect(err).to.be.null;
				expect(index).to.be.gt(0);
				indexes.push(index);
			}
		})));
	});


	context('br.qix', 'Paramirim (-42.23482,-41.84175,-13.55158,-13.44922)', tc.fix(function(qix, done) {
		var spy;

		qix.query(tc.factory.envelope(-42.23482,-41.84175,-13.55158,-13.44922), spy = tc.sinon.spy(function(err, index) {
			expect(err).to.be.null;

			if (spy.callCount >= 35) {
				done();
			}
		}));
	}));


	context('br.qix', 'Maranhão (-58.39654,-48.58000,-9.69570,0.01552)', function(qix, done) {
		var spy, indexes = [];

		qix.query(tc.factory.envelope(-58.39654,-48.58000,-9.69570,0.01552), spy = tc.sinon.spy(tc.fix(function(err, index) {
			if (spy.callCount >= 200) {
				done();
			} else {
				expect(err).to.be.null;
				expect(index).to.be.gte(0);
				indexes.push(index);
			}
		})));
	});

});