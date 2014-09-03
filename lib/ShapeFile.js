var extend = require('js-extend').extend,
path = require('path'),
jsts = require('jsts'),
Dbf = require('idbf').Dbf;


var CallbackContext = require('./CallbackContext'),
Qix = require('./Qix'),
Shp = require('./Shp'),
Shx = require('./Shx');


var SPATIAL_QUERY_OPTIONS = {
	properties: true, geometry: true
};

// TODO: JSTS Geometry Factory pool?
var JSTS_FACTORY = new jsts.geom.GeometryFactory();


var GEOMETRY_RESULT = function(index, geometry, done) {
	done.ok(null, {geometry: geometry});
};

var FEATURE_PROPERTIES_RESULT = function(dbf, includeGeometry, index, geometry, done) {

	dbf.get(index, function(err, properties) {
		if (err)
			done.error(err);
		else if (includeGeometry)
			done.ok({
				properties: properties,
				geometry: geometry
			});
		else
			done.ok({
				properties: properties
			});
	});

};

/**
 * ShapeFile class
 * @class ShapeFile
 *
 * @param {String} [varname] [description]
 */
function ShapeFile(fileName) {

	this._baseName = path.join(path.dirname(fileName), path.basename(fileName, '.shp'));
}

ShapeFile.prototype.crosses = function(geometry, options, callback) {
	return this._spatialRelation(geometry.getEnvelopeInternal(), options, callback, function(shpGeometry) {
		return shpGeometry.crosses(geometry);
	});
};

ShapeFile.prototype.contains = function(geometry, options, callback) {
	return this._spatialRelation(geometry.getEnvelopeInternal(), options, callback, function(shpGeometry) {
		return shpGeometry.contains(geometry);
	});
};

ShapeFile.prototype.dbf = function() {
	if (!this._dbf)
		this._dbf = new Dbf(this._baseName + '.dbf');

	return this._dbf;
};

ShapeFile.prototype.intersects = function(geometry, options, callback) {

	return this._spatialRelation(geometry.getEnvelopeInternal(), options, callback, function(shpGeometry) {
		return geometry.intersects(shpGeometry);
	});
};

ShapeFile.prototype.isWithinDistance = function(geometry, distance, options, callback) {

	var buffer = geometry.buffer(distance);

	return this._spatialRelation(buffer.getEnvelopeInternal(), options, callback, function(shpGeometry) {
		return jsts.operation.distance.DistanceOp.isWithinDistance(shpGeometry, geometry, distance);
	});
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

ShapeFile.prototype.within = function(geometry, options, callback) {
	return this._spatialRelation(geometry.getEnvelopeInternal(), options, callback, function(shpGeometry) {
		return shpGeometry.within(geometry);
	});
};

ShapeFile.prototype._spatialRelation = function(envelope, options, callback, filter) {

	if (!callback) {
		callback = options;
		options = SPATIAL_QUERY_OPTIONS;
	} else {
		options = extend({}, SPATIAL_QUERY_OPTIONS, options);
	}

	var callbackContext = new CallbackContext(callback);

	var dbf, result;

	if (options.properties) {
		dbf = this.dbf();
		result =  function(index, geometry, done) {
			FEATURE_PROPERTIES_RESULT(dbf, options.geometry, index, geometry, done);
		};
	} else
		result = GEOMETRY_RESULT;

	this._visit(envelope, callbackContext, filter, result);
};

ShapeFile.prototype._visit = function(envelope, callbackContext, filter, result) {
	var visitor = new Visitor(this.qix(), this.shp(), filter, result);
	return visitor.visit(envelope, callbackContext);
};

function Visitor(qix, shp, filter, result) {
	this.qix = qix;
	this.shp = shp;
	this.finished = false;
	this.pending = 0;
	this.onShp = this.onShp.bind(this);
	this.filter = filter;
	this.result = result;
}

Visitor.prototype.error = function(err) {
	this.pending--;
	this.callbackContext.error(err);

	/*if (this.finished && !this.pending)
		this.callbackContext.apply(null);*/
};

Visitor.prototype.ok = function(result) {
	this.pending--;
	this.callbackContext.apply(result);

	if (this.finished && !this.pending)
		this.callbackContext.apply(null);
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
			var valid = false;
			try {
				valid = this.filter(geometry, index);
			} catch (e) {
				this.callbackContext.error(e);
			}

			if (valid) {
				this.result(index, geometry, this);
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

	return this;
};

module.exports = ShapeFile;