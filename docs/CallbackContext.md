**Author:** rthoth (@rthoth)

Callback(*Node-style*) Context Helper


ishp.CallbackContext(callback, context)
---------------------------------------
**Parameters**

**callback**:  *Function*,  callback function

**context**:  *Object*,  this object of callback

class ishp.CallbackContext
--------------------------
**Methods**

ishp.CallbackContext.apply(args...)
-----------------------------------
Invoke callback with arguments in node-callback style

```js

callbackContext.apply(1, 2, true);

// callback function will receive null, 1, 2, true

```


**Parameters**

**args...**:  *Any...*,  


ishp.CallbackContext.error(err)
-------------------------------
Invoke callback only once with a error

```js

callbackContext.error(new Error('Strange error'));

// callback will receive Error('Strange')

```



**Parameters**

**err**:  *Error*,  


ishp.CallbackContext.ok()
-------------------------
**Returns**

*Boolean*,  Didn't callback receive error?

ishp.CallbackContext.failed()
-----------------------------
CallbackContext is failed


**Returns**

*Boolean*,  Did callback receive error?

