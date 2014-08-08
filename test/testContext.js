var chai = require('chai'),
download = require('./download'),
factory = require('./JSTSFactory'),
sinon = require('sinon');

chai.use(require('sinon-chai'));


exports.fix = function(fn) {
	return function() {
		try {
			return fn.apply(this, arguments);
		} catch (e) {
			process.nextTick(function() {
				throw e;
			});
		}
	};
};

exports.chai = chai;
exports.download = download;
exports.factory = factory;
exports.sinon = sinon;

exports.expect = function(target, mgs) {
	if (target && target.stack) {

		if (mgs)
			return chai.expect(target.stack, mgs);

		return chai.expect(target.stack);
	}


	return mgs ? chai.expect(target, mgs) : chai.expect(target);
};