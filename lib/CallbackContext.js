var slice = Array.prototype.slice;

function CallbackContext(callback, context) {

	var error, self = this;

	this.apply = function() {
		if (!error)
			callback.apply(context || self, [null].concat(slice.call(arguments)));

		return self;
	};

	this.error = function(err) {
		if (!error && err) {
			error = err;
			callback.apply(context || self, error);
		}

		return self;
	};

	this.on = function() {
		return !!error;
	};
}

module.exports = CallbackContext;