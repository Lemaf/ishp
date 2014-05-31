var path = require('path'),
CallbackContext = require('./CallbackContext'),
Qix = require('./Qix');

function ShapeFile(fileName) {
	this._baseName = path.join(path.dirname(fileName), path.basename(fileName, '.shp'));
}


ShapeFile.prototype.intersects = function(envelope, callback) {

	var callBackContext = new CallbackContext(callback);

	this.qix().query(envelope, function(err, index) {

	});

};


ShapeFile.prototype.qix = function() {

	if (!this._qix)
		this._qix = new Qix(this._baseName + '.qix');
	return this._qix;
};


module.exports = ShapeFile;