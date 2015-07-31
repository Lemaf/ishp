var chai = require('chai'),
download = require('./download'),
factory = require('./JSTSFactory'),
sinon = require('sinon');

chai.use(require('sinon-chai'));


exports.throwAfter = function(fn) {
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

exports.asc = function(a, b) { return a - b; };

exports.callBackContext = function(description, fn) {
	var CallbackContext = require('../lib/CallbackContext');
	it(description, function() {
		var spy = sinon.spy();
		fn.call(this, new CallbackContext(spy), spy);
	});
};

exports.expect = function(target, msg) {

	if (target && target.stack)
		console.log(target.stack);

	if (msg)
		return chai.expect(target, msg);
	else
		return chai.expect(target);
};

exports.qixContext = function(file, description, fn) {

	var Qix = require('../lib/Qix');

	it(description, function(done) {
		var qix = new Qix(file);

		fn.call(this, qix, done);
	});
};

exports.shpContext = function(file, description, fn) {

	var Shx = require('../lib/Shx');
	var Shp = require('../lib/Shp');


	it(description, function(done) {
		var shp = new Shp(file, new Shx(file.replace('.shp', '.shx')), factory);
		
		fn.call(this, shp, done);
	});
};

exports.shapeFileContext = function(file, description, fn) {

	var ShapeFile = require('../lib/ShapeFile');

	var shapeFile = new ShapeFile(file);

	it(description, function(done) {

		fn.call(this, shapeFile, done);
	});

};