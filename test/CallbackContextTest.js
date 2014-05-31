var chai = require('chai'),
sinon = require('sinon'),
CallbackContext = require('../lib/CallbackContext');

var expect = chai.expect;
chai.use(require('sinon-chai'));

describe('CallbackContext', function() {

	
	it('normal invoke without arguments', function(done) {

		new CallbackContext(function(err) {

			expect(arguments).to.have.length(1);
			expect(err).to.not.exist;
			done();
		}).apply();
	});

	it('normal invoke with arguments', function() {

		var spy = sinon.spy();

		new CallbackContext(spy).apply(1,2, true, "Aliens vs Monsters");
		expect(spy).to.have.been.calledOnce;
		expect(spy).to.have.been.calledWith(null, 1, 2, true, "Aliens vs Monsters");
	});


	it('normal, error, normal (no effect) invoke', function() {

		var spy = sinon.spy();
		var callbackContext = new CallbackContext(spy);

		callbackContext.apply('ID4');
		callbackContext.error(new Error('Godzilla'));
		callbackContext.apply('The Day After Tomorrow');

		expect(spy).to.have.been.calledTwice;
		expect(spy).to.have.been.calledWith(null, 'ID4');
		expect(spy).to.have.been.calledWith(new Error('Godzilla'));
	});

});
