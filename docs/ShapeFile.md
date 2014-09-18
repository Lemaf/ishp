ishp
===





---

ishp.ShapeFile
===


### ishp.ShapeFile(fileName)

**Parameters**

**fileName**: String, .shp file


---




ishp.ShapeFile.crosses(geometry, options, callback) 
-----------------------------

See [jsts.geometry.Geometry.crosses](file:///home/rthoth.arch/GITs/jsts/doc/api/symbols/jsts.geom.Geometry.html#crosses)

**Parameters**

**geometry**: jsts.geom.Geometry, -

**options**: Object, [See Options](#options)

**callback**: function, callback-stream [See CallbackStream](#callbackStream)





ishp.ShapeFile.contains(geometry, options, callback) 
-----------------------------

See [jsts.geometry.Geometry.contains](file:///home/rthoth.arch/GITs/jsts/doc/api/symbols/jsts.geom.Geometry.html#contains)

**Parameters**

**geometry**: jsts.geom.Geometry, -

**options**: Object, [See Options](#options)

**callback**: function, callback-stream [See CallbackStream](#callbackStream)





ishp.ShapeFile.dbf() 
-----------------------------

Returns .dbf of ShapeFile

**Returns**: DBF, [See](https://www.npmjs.org/package/idbf)




ishp.ShapeFile.intersects(geometry, options, callback) 
-----------------------------

See [jsts.geometry.Geometry.intersects](file:///home/rthoth.arch/GITs/jsts/doc/api/symbols/jsts.geom.Geometry.html#intersects)

**Parameters**

**geometry**: jsts.geom.Geometry, -

**options**: Object, [See Options](#options)

**callback**: function, callback-stream [See CallbackStream](#callbackStream)





ishp.ShapeFile.isWithinDistance(geometry, distance, options, callback) 
-----------------------------

See [jsts.geometry.Geometry.isWithinDistance](file:///home/rthoth.arch/GITs/jsts/doc/api/symbols/jsts.geom.Geometry.html#isWithinDistance)

**Parameters**

**geometry**: jsts.geom.Geometry, -

**distance**: Number, -

**options**: Object, [See Options](#options)

**callback**: function, callback-stream [See CallbackStream](#callbackStream)





ishp.ShapeFile.qix() 
-----------------------------

Qix .qix file (Spatial QuadTree Index File)

**Returns**: Qix, [Qix](Qix.md)




ishp.ShapeFile.shp() 
-----------------------------

Shp .shp file

**Returns**: Shp, [Shp](Shp.md)




ishp.ShapeFile.shx() 
-----------------------------

Shx .shx file

**Returns**: Shx, [Shx](Shx.md)




ishp.ShapeFile.within(geometry, distance, options, callback) 
-----------------------------

See [jsts.geometry.Geometry.within](file:///home/rthoth.arch/GITs/jsts/doc/api/symbols/jsts.geom.Geometry.html#within)

**Parameters**

**geometry**: jsts.geom.Geometry, -

**distance**: Number, -

**options**: Object, [See Options](#options)

**callback**: function, callback-stream [See CallbackStream](#callbackStream)




---



@rthoth



**Overview:** .

#### <a name="options">Options</a>

Property   | Default | Description
-----------|:-------:|---------------------------------------
properties | true    | Feature with DBF content (properties)
geometry   | true    | Feature with geometry field (JSTS Geometry)

#### <a name="callbackStream">Callback Stream</a>

Callback Stream

It's a function receive follow arguments:

* **err** - If a error happen and no invoked again by ishp
* **feature** - GeoJSON like feature (geometry field is a JSTS Geometry)
