**Author:** rthoth

ShapeFile class - **open .shp file!**

### Callback format

Callbacks are *node-style*, they receive arguments bellow:

1. err: *Error*
2. feature: *GeoJSON-style*


### GeoJSON-style

ishp [Feature GeoJSON](http://geojson.org/geojson-spec.html#feature-objects) has a bit difference,
member geometry is a [JSTS Geometry](https://github.com/bjornharrtell/jsts)

*ishp Feature* is defined bellow:

* properties: *Object*, like standard feature GeoJSON
* geometry: *jsts.geom.Geometry*


ishp.ShapeFile(fileName)
------------------------
**Parameters**

**fileName**:  *String*,  .shp location

class ishp.ShapeFile
--------------------
**Methods**

ishp.ShapeFile.crosses(geometry, options, callback)
---------------------------------------------------
[jsts.geom.Geometry.crosses](http://bjornharrtell.github.io/jsts/doc/api/symbols/jsts.geom.Geometry.html#crosses)



**Parameters**

**geometry**:  *jsts.geom.Geometry*,  


**options**:  *Object*,  optional

**callback**:  *Function*,  


ishp.ShapeFile.contains(geometry, options, callback)
----------------------------------------------------
[jsts.geom.Geometry.contains](http://bjornharrtell.github.io/jsts/doc/api/symbols/jsts.geom.Geometry.html#contains)



**Parameters**

**geometry**:  *jsts.geom.Geometry*,  


**options**:  *Object*,  optional

**callback**:  *Function*,  


ishp.ShapeFile.dbf()
--------------------
[See idbf](https://github.com/rthoth/idbf)


**Returns**

*idbf.Dbf*,  XDase from .dbf

ishp.ShapeFile.intersects(geometry, options, callback)
------------------------------------------------------
[jsts.geom.Geometry.intersects](http://bjornharrtell.github.io/jsts/doc/api/symbols/jsts.geom.Geometry.html#intersects)


**Parameters**

**geometry**:  *jsts.geom.Geometry*,  


**options**:  *Object*,  is optional

**callback**:  *Function*,  


ishp.ShapeFile.isWithinDistance(geometry, options, callback)
------------------------------------------------------------
[jsts.geom.Geometry.isWithinDistance](http://bjornharrtell.github.io/jsts/doc/api/symbols/jsts.geom.Geometry.html#isWithinDistance)


**Parameters**

**geometry**:  *jsts.geom.Geometry*,  


**options**:  *Object*,  is optional

**callback**:  *Function*,  


ishp.ShapeFile.qix()
--------------------
**Returns**

*ishp.Qix*,  Qix

ishp.ShapeFile.shp()
--------------------
**Returns**

*ishp.Shp*,  Shp

ishp.ShapeFile.shx()
--------------------
**Returns**

*ishp.Shx*,  Shx

ishp.ShapeFile.within(geometry, options, callback)
--------------------------------------------------
[jsts.geom.Geometry.within](http://bjornharrtell.github.io/jsts/doc/api/symbols/jsts.geom.Geometry.html#within)


**Parameters**

**geometry**:  *jsts.geom.Geometry*,  


**options**:  *Object*,  is optional

**callback**:  *Function*,  


