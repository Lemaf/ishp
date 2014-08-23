module.exports = function NestedError(message, cause) {

	var err = new Error(message);
	err.cause = cause;
	err.stack = err.stack + '\nCaused By: ' + cause.stack;

	return err;
};