var extend = require('js-extend').extend,
path = require('path'),
jsts = require('jsts'),
Dbf = require('idbf').Dbf;


var CallbackContext = require('./CallbackContext'),
Qix = require('./Qix'),
Shp = require('./Shp'),
Shx = require('./Shx');


var INTERSECTS_OPTIONS = {
	properties: true, geometry: true
};

// TODO: JSTS Geometry Factory pool?

var JSTS_FACTORY = new jsts.geom.GeometryFactory();


var GEOMETRY_RESULT = function(index, geometry, done) {
	done(null, {geometry: geometry});
};

var FEATURE_RESULT = function(dbf, options, index, geometry, done) {

	dbf.get(index, function(err, properties) {
		if (err)
			done(err);
		else {
			if (options.geometry)
				done(null, {
					properties: properties,
					geometry: geometry
				});
			else
				done(null, {
					properties: properties
				});
		}
	});

};

function ShapeFile(fileName) {
	this._baseName = path.join(path.dirname(fileName), path.basename(fileName, '.shp'));
}

ShapeFile.prototype.intersects = function(geometry, options, callback) {

	if (!callback) {
		callback = options;
		options = INTERSECTS_OPTIONS;
	} else {
		options = extend({}, INTERSECTS_OPTIONS, options);
	}



	var envelope = geometry.getEnvelopeInternal(), pending = 0, finished = false;

	var callbackContext = new CallbackContext(callback);

	var dbf, shp = this.shp(), result;

	if (options.properties) {
		dbf = this.dbf();
		result =  function(index, geometry, done) {
			FEATURE_RESULT(dbf, options.geometry, index, geometry, done);
		};
	} else
		result = GEOMETRY_RESULT;

	var filter = function(shpGeometry) {
		return geometry.intersects(shpGeometry);
	};

	var visitor = new Visitor(this, filter, result);

	visitor.visit(envelope, callbackContext);

};


ShapeFile.prototype.dbf = function() {
	if (!this._dbf)
		this._dbf = new Dbf(this._baseName + '.dbf');

	return this._dbf;
};

ShapeFile.prototype.qix = function() {

	if (!this._qix)
		this._qix = new Qix(this._baseName + '.qix');
	return this._qix;
};

ShapeFile.prototype.shp = function() {
	if (!this._shp)
		this._shp = new Shp(this._baseName + '.shp', this.shx(), JSTS_FACTORY);

	return this._shp;
};

ShapeFile.prototype.shx = function() {
	if (!this._shx)
		this._shx = new Shx(this._baseName + '.shx');

	return this._shx;
};


function Visitor(shapeFile, filter, result) {
	this.qix = shapeFile.qix();
	this.shp = shapeFile.shp();
	this.finished = false;
	this.pending = 0;
	this.onShp = this.onShp.bind(this);
	this.done = this.done.bind(this);
	this.filter = filter;
	this.result = result;
}

Visitor.prototype.done = function(err, result) {
	this.pending--;
	if (err)
		this.callbackContext.error(err);
	else {
		this.callbackContext.apply(result);
		if (this.finished && !this.pending)
			this.callbackContext.apply(null);
	}

};

Visitor.prototype.onQix = function(err, index) {
	if (this.callbackContext.ok()) {
		if (err)
			this.callbackContext.error(err);
		else {
			if (index !== null) {
				this.pending++;
				this.shp.get(index, this.onShp);
			} else if (this.pending) {
				this.finished = true;
			} else if (!this.finished) {
				this.callbackContext.apply(null);
			}
		}
	}
};

Visitor.prototype.onShp = function(err, geometry, index) {
	if (this.callbackContext.ok()) {
		if (err) {
			this.pending--;
			this.callbackContext.error(err);
		} else {
			var filterResult = null;
			try {
				filterResult = this.filter(geometry);
			} catch (e) {
				this.callbackContext.error(e);
			}

			if (filterResult) {
				this.result(index, geometry, this.done);
			} else {
				this.pending--;
			}
		}
	} else
		this.pending--;
};

Visitor.prototype.visit = function(envelope, callbackContext) {
	this.callbackContext = callbackContext;
	this.qix.query(envelope, this.onQix.bind(this));
};


module.exports = ShapeFile;