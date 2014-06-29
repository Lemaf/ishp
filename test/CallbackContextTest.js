var chai = require('chai'),
download = require('./download'),
sinon = require('sinon');

var CallbackContext = require('../lib/CallbackContext');

chai.use(require('sinon-chai'));

var expect = chai.expect;


function context(description, fn) {

	it(description, function() {
		var spy = sinon.spy();
		fn.call(this, new CallbackContext(spy), spy);
	});
}

describe('CallbackContext', function() {

	context('simple invoke', function(cbc, spy) {

		cbc.apply('Ok');
		expect(spy).have.calledWith(null, 'Ok');
	});

	context('invoke, error and invoke', function(cbc, spy) {

		cbc.apply('Another test');
		expect(spy).have.calledWith(null, 'Another test');
		
		cbc.error(new Error('A super and unexpected error'));
		expect(spy).have.calledWith(new Error('A super and unexpected error'));

		cbc.apply('Woo hoo');
		expect(spy).not.have.calledWith(null, 'Woo hoo');
	});

	it('invoke and throw error and call again', function() {
		var error = new Error('A error');
		var spy = sinon.spy(function(err, arg) {
			throw error;
		});

		var cbc = new CallbackContext(spy);
		cbc.apply('lol');

		expect(spy).have.calledWith(null, 'lol');
		expect(spy).have.thrown(error);

		cbc.apply('Test');
		expect(spy).have.calledWith(null, 'Test');

	});

	context('invoke, error, not invoke again', function(cbc, spy) {
		cbc.apply(true);
		expect(spy).have.calledWith(null, true);
		var error = new Error('Internal Error');

		cbc.error(error);
		expect(spy).have.calledWith(error);

		cbc.apply(false);
		expect(spy).not.have.calledWith(null, false);
	});
});