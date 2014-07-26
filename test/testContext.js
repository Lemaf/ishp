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
exports.expect = chai.expect;