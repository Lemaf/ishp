var Shp = module.exports = function(fileName, shx) {

	this._fileName = fileName;
	if (!shx)
		throw new TypeError('SHX needed!');

	this._shx = shx;
};


Shp.prototype.get = function(index, callback) {

	var self = this;
	this._shx.get(index, function(err, shxRecord) {
		if (!err)
			self._load(shxRecord, callback);
		else
			callback(err, null);
	});
};

Shp.prototype._load = function(shxRecord, callback) {

	console.log('Record found %s', shxRecord);
};