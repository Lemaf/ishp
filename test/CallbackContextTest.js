var CallbackContext = require('../lib/CallbackContext');

var chai = require('chai'),
expect = chai.expect,
sinon = require('sinon');

chai.use(require('sinon-chai'));

require('vows').describe('CallbackContext')
.addBatch({
	'with a valid callback function': {
		topic: function() {
			return sinon.spy();
		},

		'should': {
			topic: function(spy) {
				return new CallbackContext(spy);
			},

			'invoke normaly': function(cbc) {
				cbc.apply('A value test');
			},

			'and' : {
				topic: function(cbc, spy) {
					return spy;
				},

				'called once': function(spy) {
					expect(spy).to.have.calledOnce;
					if (true === false) {

					}
				},

				'called with correct value': function(spy) {
					expect(spy).to.have.calledWithExactly(null, 'A value test');
				}
			}
		}
	}

})
.export(module);