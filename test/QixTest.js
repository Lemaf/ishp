var chai = require('chai'),
download = require('./download'),
jsts = require('jsts'),
sinon = require('sinon');

var Qix = require('../lib/Qix');

chai.use(require('sinon-chai'));

var expect = chai.expect;

function context(file, description, fn) {
	it(description, function(done) {
		var qix = new Qix(file);

		fn.call(this, qix, done);
	});
}

function envelope(xmin, xmax, ymin, ymax) {
	return new jsts.geom.Envelope(xmin, xmax, ymin, ymax);
}

function fix(fn) {
	return function() {
		try {
			return fn.apply(this, arguments);
		} catch (e) {
			process.nextTick(function() {
				throw e;
			});
		}
	};
}


describe('Qix', function() {

	before(download([
		{
			url: 'https://copy.com/yzHc6aQO76ko/shp.js/br.sp.zip?download=1',
			test: 'br.sp.shp',
			name: 'br.sp'
		}
	]));

	context('br.sp.qix', 'teste', function(qix, done) {

		this.timeout(0);
		var spy;
		qix.query(envelope(-48.01596,-47.95535,-21.14624,-21.09490), spy = sinon.spy(fix(function(err, index) {
			console.log('callCount =%d, index=%d', spy.callCount, index);
			if (spy.callCount >= 12) {
				//expect(spy).have.calledWith(null, 1);
				done();
			}
		})));
	});

});