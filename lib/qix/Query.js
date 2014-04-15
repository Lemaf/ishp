//var Index = require('../Index');
var fsIO = require('../fs-ext-promise-io');
var Deferred = require('promised-io/promise').Deferred;
var CTypes = require('../CTypes');

// look at http://jsperf.com/bind-vs-wrapped-vs-direct
// look at http://jsperf.com/wrapper-x-apply-x-bind-x-direct

var Qix = module.exports = function(path, validate) {
	this._path = path;
	this._validate = validate;

	var self = this;
	this._fdPromise = fsIO.open(path, 'r').then(
		function(fd) {
			self._openSuccess(fd);
		},
		function(error) {
			self._openError(error);
		}
	);
};


Qix.prototype.query = function(envelope) {
	return (new Query(envelope, this._fdPromise)).promise;
};

Qix.prototype._openError = function(error) {

};

Qix.prototype._openSuccess = function(fd) {
	this._fd = fd;
};

var Query = function(envelope, filePromise) {
	this._deferred = new Deferred();
	this.promise = this._deferred.promise;

	var self = this;
	filePromise.then(
		function(fd) {
			self._apply(fd, envelope);
		},

		function(error) {
			self._error(envelope, error);
		}
	);

};