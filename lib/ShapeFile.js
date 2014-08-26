/**
 * @title ShapeFile
 * @module ishp
*/

/**
 *
 * @author rthoth
 * #### Callback format
 * Callbacks are *node-style*, they receive arguments bellow:
 * 
 * 1. err: *Error*
 * 2. feature: *GeoJSON-style*
 *
 * #### GeoJSON-style
 *
 * ishp [Feature GeoJSON](http://geojson.org/geojson-spec.html#feature-objects) 
 * has a bit difference, member geometry is a [JSTS Geometry](https://github.com/bjornharrtell/jsts)
 *
 * *ishp Feature* is defined bellow:
 *
 * * properties: *Object*, like standard feature GeoJSON
 * * geometry: *jsts.geom.Geometry*
 * 
*/


/**
 * module ishp
 */

/**
 * Teste
 * @member {Object} teste ?
 */
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
	ShapeFile class - **open .shp file!**
	@class ShapeFile
*/


/**
	@param {String} fileName .shp location
	@returns {ishp.ShapeFile} ShapeFile
*/
function ShapeFile(fileName) {

	this._baseName = path.join(path.dirname(fileName), path.basename(fileName, '.shp'));
}

/**
	[jsts.geom.Geometry.crosses](http://bjornharrtell.github.io/jsts/doc/api/symbols/jsts.geom.Geometry.html#crosses)
	@method

	@param {jsts.geom.Geometry} geometry
	@param {Object} options optional
	@param {Function} callback
*/
ShapeFile.prototype.crosses = function(geometry, options, callback) {
	return this._spatialRelation(geometry.getEnvelopeInternal(), options, callback, function(shpGeometry) {
		return shpGeometry.crosses(geometry);
	});
};

/**
	[jsts.geom.Geometry.contains](http://bjornharrtell.github.io/jsts/doc/api/symbols/jsts.geom.Geometry.html#contains)
	@method

	@param {jsts.geom.Geometry} geometry
	@param {Object} options optional
	@param {Function} callback
*/
ShapeFile.prototype.contains = function(geometry, options, callback) {
	return this._spatialRelation(geometry.getEnvelopeInternal(), options, callback, function(shpGeometry) {
		return shpGeometry.contains(geometry);
	});
};

/**
  [See idbf](https://github.com/rthoth/idbf)
	@method
	@returns {idbf.Dbf} XDase from .dbf
*/
ShapeFile.prototype.dbf = function() {
	if (!this._dbf)
		this._dbf = new Dbf(this._baseName + '.dbf');

	return this._dbf;
};

/**
	[jsts.geom.Geometry.intersects](http://bjornharrtell.github.io/jsts/doc/api/symbols/jsts.geom.Geometry.html#intersects)
	@method
	@param {jsts.geom.Geometry} geometry
	@param {Object} options is optional
	@param {Function} callback
*/
ShapeFile.prototype.intersects = function(geometry, options, callback) {

	return this._spatialRelation(geometry.getEnvelopeInternal(), options, callback, function(shpGeometry) {
		return geometry.intersects(shpGeometry);
	});
};

/**
	[jsts.geom.Geometry.isWithinDistance](http://bjornharrtell.github.io/jsts/doc/api/symbols/jsts.geom.Geometry.html#isWithinDistance)
	@method
	@param {jsts.geom.Geometry} geometry
	@param {Number} distance
	@param {Object} options is optional
	@param {Function} callback
*/
ShapeFile.prototype.isWithinDistance = function(geometry, distance, options, callback) {

	var buffer = geometry.buffer(distance);

	return this._spatialRelation(buffer.getEnvelopeInternal(), options, callback, function(shpGeometry) {
		return jsts.operation.distance.DistanceOp.isWithinDistance(shpGeometry, geometry, distance);
	});
};

/**
	@method
	@returns {ishp.Qix} Qix
*/
ShapeFile.prototype.qix = function() {

	if (!this._qix)
		this._qix = new Qix(this._baseName + '.qix');
	return this._qix;
};

/**
	@method
	@returns {ishp.Shp} Shp
*/
ShapeFile.prototype.shp = function() {
	if (!this._shp)
		this._shp = new Shp(this._baseName + '.shp', this.shx(), JSTS_FACTORY);

	return this._shp;
};

/**
	@method
	@returns {ishp.Shx} Shx
*/
ShapeFile.prototype.shx = function() {
	if (!this._shx)
		this._shx = new Shx(this._baseName + '.shx');

	return this._shx;
};

/**
	[jsts.geom.Geometry.within](http://bjornharrtell.github.io/jsts/doc/api/symbols/jsts.geom.Geometry.html#within)
	@method
	@param {jsts.geom.Geometry} geometry
	@param {Object} options is optional
	@param {Function} callback
*/
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