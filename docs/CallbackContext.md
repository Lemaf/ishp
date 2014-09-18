ishp
===





---

ishp.CallbackContext
===
Callback(*Node-style*) Context Class

*Example*

```js

function callback(err, a, b) {
  console.log("err=%s, a=%s, b=%s", err, a, b);
}

var callbackContext = new CallbackContext(callback, this);

```

### ishp.CallbackContext(callback, context)

**Parameters**

**callback**: function, 

**context**: Object, 


---




ishp.CallbackContext.apply(args...) 
-----------------------------

Apply

```js 

callbackContext.apply(1,"two");

// log
// err=null, a=1, b=two

callbackContext.apply();

// log
// err=null, a=undefined, b=undefined

callbackContext.apply("true", "false", "string")

// log
// err=null, a=true, b=false

```

**Parameters**

**args...**: Any, arguments





ishp.CallbackContext.error(err) 
-----------------------------

Invoke callback with a error and never again

```js

callbackContext.error(new Error("A unexpected error"));

// log
// err=A unexpected error, a=undefined, b=undefined

callbackContext.apply("Wakeup!", "Now!");

// no log!

```

**Parameters**

**err**: Error, Invoke callback with a error and never again

```js

callbackContext.error(new Error("A unexpected error"));

// log
// err=A unexpected error, a=undefined, b=undefined

callbackContext.apply("Wakeup!", "Now!");

// no log!

```





ishp.CallbackContext.ok() 
-----------------------------

Context ok?

**Returns**: Boolean, 




ishp.CallbackContext.failed() 
-----------------------------

Context failed?

**Returns**: Boolean, 



---



@rthoth




