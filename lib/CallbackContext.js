/**
 * @author @rthoth
 * @overview
 */

/**
 * @module ishp
 */


var slice = Array.prototype.slice;

/**
 * Callback(*Node-style*) Context Class
 *
 * *Example*
 * 
 *```js
 *
 * function callback(err, a, b) {
 *   console.log("err=%s, a=%s, b=%s", err, a, b);
 * }
 * 
 * var callbackContext = new CallbackContext(callback, this);
 * 
 *```
 *
 * @class
 * @param {Function} callback
 * @param {Object} [context]
 */

function CallbackContext(callback, context) {

	if (!(this instanceof CallbackContext))
		return new CallbackContext(callback, context);

	var error, self = this;

	/**
	 * Apply
	 * 
	 *```js 
	 *
	 * callbackContext.apply(1,"two");
	 *
	 * // log
	 * // err=null, a=1, b=two
	 *
	 * callbackContext.apply();
	 *
	 * // log
	 * // err=null, a=undefined, b=undefined
	 *
	 * callbackContext.apply("true", "false", "string")
	 *
	 * // log
	 * // err=null, a=true, b=false
	 *
	 *```
	 * 
	 * @param {Any} [args...] arguments
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
	 * Invoke callback with a error and never again
	 *
	 *```js
	 *
	 * callbackContext.error(new Error("A unexpected error"));
	 *
	 * // log
	 * // err=A unexpected error, a=undefined, b=undefined
	 *
	 * callbackContext.apply("Wakeup!", "Now!");
	 *
	 * // no log!
	 *
	 *```
	 * 
	 * @param  {Error} err
	 */
	this.error = function(err) {
		if (!error && err) {
			error = err;
			callback.call(context || self, error);
		}

		return self;
	};

	/**
	 * Context ok?
	 * @return {Boolean}
	 */
	this.ok = function() {
		return !error;
	};

	/**
	 * Context failed?
	 * @return {Boolean}
	 */
	this.failed = function() {
		return !!error;
	};
}

module.exports = CallbackContext;