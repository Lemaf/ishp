/**
	@module ishp
*/
var slice = Array.prototype.slice;

/**
	CallbackContext is a helper class
	@author rthoth
	@class CallbackContext
*/

/**
	Create new CallbackContext
	@param Function callback
	@param [Object] context this object of callback
*/
function CallbackContext(callback, context) {

	if (!(this instanceof CallbackContext))
		return new CallbackContext(callback, context);

	var error, self = this;

	/**
		Invoke callback with arguments in node-callback style

		```js

			callbackContext.apply(1, 2, true);

			// callback function will receive null, 1, 2, true
		
		```
		@method apply
		@param Any... any...
	*/
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

	/**
		Invoke callback just one time with a error
		@method

		@param Error err callback error
	*/
	this.error = function(err) {
		if (!error && err) {
			error = err;
			callback.call(context || self, error);
		}

		return self;
	};

	/**
		CallbackContext is ok?
		@method
		@returns Boolean
	*/
	this.ok = function() {
		return !error;
	};

	/**
		CallbackContext is failed
		@method
		@returns Boolean
	*/
	this.failed = function() {
		return !!error;
	};
}

module.exports = CallbackContext;