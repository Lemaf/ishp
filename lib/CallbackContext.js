function CallbackContext(callback, context) {

	this._callback = callback;
	this._context = context || this;
}

var push = Array.prototype.push;


CallbackContext.prototype.apply = function() {

	if (!this._error) {
		var args = [null];
		push.apply(args, arguments);
		this._callback.apply(this._context, args);
	}

	return this;

};

CallbackContext.prototype.error = function(error) {

	if (!this._error && this._error !== error) {
		try {
			this._callback.call(this._context, error);
		} finally {
			this._error = error;
		}
	}

	return this;
};

CallbackContext.prototype.ok = function() {
	return !!this._error;
};



module.exports = CallbackContext;