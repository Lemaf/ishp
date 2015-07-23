/**
 * .
 * 
 * #### <a name="options">Options</a>
 *
 * Name       | Default | Description
 * -----------|:-------:|---------------------------------------
 * properties | true    | Feature with DBF content (properties)
 * geometry   | true    | Feature with geometry field (JSTS Geometry)
 *
 * #### <a name="callbackStream">Callback Stream</a>
 *
 * Callback Stream
 *
 * It's a function receive follow arguments:
 *
 * * **err** - If a error happen and no invoked again by ishp
 * * **feature** - GeoJSON like feature (geometry field is a JSTS Geometry)
 *
 * 
 * @author @rthoth
 * @overview
 */

/**
 * @module  ishp
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
 * @class ShapeFile
 *
 * @param {String} fileName .shp file
 */
function ShapeFile(fileName) {

	this._baseName = path.join(path.dirname(fileName), path.basename(fileName, '.shp'));
}

/**
 * See [jsts.geometry.Geometry.crosses](file:///home/rthoth.arch/GITs/jsts/doc/api/symbols/jsts.geom.Geometry.html#crosses)
 * @param  {jsts.geom.Geometry}   geometry -
 * @param  {Object}  options  [See Options](#options)
 * @param  {Function} callback callback-stream [See CallbackStream](#callbackStream)
 */
ShapeFile.prototype.crosses = function(geometry, options, callback) {
	return this._spatialRelation(geometry.getEnvelopeInternal(), options, callback, function(shpGeometry) {
		return shpGeometry.crosses(geometry);
	});
};

/**
 * See [jsts.geometry.Geometry.contains](file:///home/rthoth.arch/GITs/jsts/doc/api/symbols/jsts.geom.Geometry.html#contains)
 * @param  {jsts.geom.Geometry}   geometry -
 * @param  {Object}  options  [See Options](#options)
 * @param  {Function} callback callback-stream [See CallbackStream](#callbackStream)
 */
ShapeFile.prototype.contains = function(geometry, options, callback) {
	return this._spatialRelation(geometry.getEnvelopeInternal(), options, callback, function(shpGeometry) {
		return shpGeometry.contains(geometry);
	});
};

/**
 * Returns .dbf of ShapeFile
 * @return {DBF} [See](https://www.npmjs.org/package/idbf)
 */
ShapeFile.prototype.dbf = function() {
	if (!this._dbf)
		this._dbf = new Dbf(this._baseName + '.dbf');

	return this._dbf;
};

/**
 * See [jsts.geometry.Geometry.intersects](file:///home/rthoth.arch/GITs/jsts/doc/api/symbols/jsts.geom.Geometry.html#intersects)
 * @param  {jsts.geom.Geometry}   geometry -
 * @param  {Object}  options  [See Options](#options)
 * @param  {Function} callback callback-stream [See CallbackStream](#callbackStream)
 */
ShapeFile.prototype.intersects = function(geometry, options, callback) {

	return this._spatialRelation(geometry.getEnvelopeInternal(), options, callback, function(shpGeometry) {
		return geometry.intersects(shpGeometry);
	});
};

/**
 * See [jsts.geometry.Geometry.isWithinDistance](file:///home/rthoth.arch/GITs/jsts/doc/api/symbols/jsts.geom.Geometry.html#isWithinDistance)
 * @param  {jsts.geom.Geometry}  geometry -
 * @param {Number} distance -
 * @param  {Object}  options  [See Options](#options)
 * @param  {Function} callback callback-stream [See CallbackStream](#callbackStream)
 */
ShapeFile.prototype.isWithinDistance = function(geometry, distance, options, callback) {

	var buffer = geometry.buffer(distance);

	return this._spatialRelation(buffer.getEnvelopeInternal(), options, callback, function(shpGeometry) {
		return jsts.operation.distance.DistanceOp.isWithinDistance(shpGeometry, geometry, distance);
	});
};

/**
 * Qix .qix file (Spatial QuadTree Index File)
 * @return {Qix} [Qix](Qix.md)
 */
ShapeFile.prototype.qix = function() {

	if (!this._qix)
		this._qix = new Qix(this._baseName + '.qix');
	return this._qix;
};

/**
 * 
 */
ShapeFile.prototype.searchRecord = function(filter, iterator, done) {

	var shp = this.shp(), iterate = true;

	this.dbf().forEach(function(record, index){

		if (iterate && filter(record, index)) {

			shp.get((index), function(err, geometry) {

				if (err) {
					iterate = false;
					done(err);
					return;
				}

				var feature = {
					properties : record,
					geometry : geometry
				}

				iterator(feature);

			});
		}

	}, function(err) {
		if(iterate) {
			iterate = false;
			done(err);
		}
	});

};

/**
 * Shp .shp file
 * @return {Shp} [Shp](Shp.md)
 */
ShapeFile.prototype.shp = function() {
	if (!this._shp)
		this._shp = new Shp(this._baseName + '.shp', this.shx(), JSTS_FACTORY);

	return this._shp;
};

/**
 * Shx .shx file
 * @return {Shx} [Shx](Shx.md)
 */
ShapeFile.prototype.shx = function() {
	if (!this._shx)
		this._shx = new Shx(this._baseName + '.shx');

	return this._shx;
};

/**
 * See [jsts.geometry.Geometry.within](file:///home/rthoth.arch/GITs/jsts/doc/api/symbols/jsts.geom.Geometry.html#within)
 * @param  {jsts.geom.Geometry}  geometry -
 * @param {Number} distance -
 * @param  {Object}  options  [See Options](#options)
 * @param  {Function} callback callback-stream [See CallbackStream](#callbackStream)
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
	this.filter = filter;
	this.result = result;

	var self = this;
	this._onShp = function(err, geometry, index) {
		self.onShp(err, geometry, index);
	};
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
				this.shp.get(index, this._onShp);
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
	var self = this;
	this.qix.query(envelope, function(err, index) {
		self.onQix(err, index);
	});

	return this;
};

module.exports = ShapeFile;