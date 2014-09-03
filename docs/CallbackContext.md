Global
===





---

CallbackContext
===


CallbackContext.apply(args...) 
-----------------------------
Invoke callback with arguments in node-callback style

```js

callbackContext.apply(1, 2, true);
// callback function will receive null, 1, 2, true

```

**Parameters**

**args...**: Any, Invoke callback with arguments in node-callback style

```js

callbackContext.apply(1, 2, true);
// callback function will receive null, 1, 2, true

```

CallbackContext.error(err) 
-----------------------------
Invoke callback only once with a error
	
		```js

		callbackContext.error(new Error('Strange error'));

		// callback will receive Error('Strange')

		```

**Parameters**

**err**: Error, Invoke callback only once with a error
	
		```js

		callbackContext.error(new Error('Strange error'));

		// callback will receive Error('Strange')

		```

CallbackContext.ok() 
-----------------------------
**Returns**: Boolean, Didn't callback receive error?
CallbackContext.failed() 
-----------------------------
CallbackContext is failed

**Returns**: Boolean, Did callback receive error?


---



rthoth (@rthoth)

**Overview:** teste


