var slice = Array.prototype.slice;
/**
 * @overview teste
 * @author rthoth (@rthoth)
 */

/**
 * @title CallbackContext TITLE
 * Callback(*Node-style*) Context Helper
 * @class CallbackContext
 *
 * @param {String} callback [description]
 */

function CallbackContext(callback, context) {

	if (!(this instanceof CallbackContext))
		return new CallbackContext(callback, context);

	var error, self = this;

	/**
	 * Invoke callback with arguments in node-callback style
	 *
	 *```js
	 *
	 * callbackContext.apply(1, 2, true);
	 * // callback function will receive null, 1, 2, true
	 *
	 *```
	 * @method apply
	 * @param {Any} args...
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
		Invoke callback only once with a error
	
		```js

		callbackContext.error(new Error('Strange error'));

		// callback will receive Error('Strange')

		```

		@method error
		@param {Error} err
	*/
	this.error = function(err) {
		if (!error && err) {
			error = err;
			callback.call(context || self, error);
		}

		return self;
	};

	/**
		@method
		@returns {Boolean} Didn't callback receive error?
	*/
	this.ok = function() {
		return !error;
	};

	/**
		CallbackContext is failed
		@method
		@returns {Boolean} Did callback receive error?
	*/
	this.failed = function() {
		return !!error;
	};
}

module.exports = CallbackContext;