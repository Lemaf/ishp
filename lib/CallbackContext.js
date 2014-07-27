var slice = Array.prototype.slice;

function CallbackContext(callback, context) {

	if (!(this instanceof CallbackContext))
		return new CallbackContext(callback, context);

	var error, self = this;

	this.apply = function() {
		if (!error)
			try {
				callback.apply(context || self, [null].concat(slice.call(arguments)));
			} catch (e)  {
				// TODO: What to do?
				//console.log('CallbackContext apply error:\n%s', e.stack);
			}

		return self;
	};

	this.error = function(err) {
		if (!error && err) {
			error = err;
			callback.call(context || self, error);
		}

		return self;
	};

	this.ok = function() {
		return !error;
	};

	this.failed = function() {
		return !!error;
	};
}

module.exports = CallbackContext;