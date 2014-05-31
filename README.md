# ishp


A spatial indexed (qix quadtree) Shapefile reader


ishp uses qix quadtree, you can use [mapserver](http://mapserver.org/utilities/shptree.html) or [Quantum GIS](http://www.qgis.org/) to create a qix file.


```js

 var ishp = require('ishp');
 
 var brazil = new ishp.ShapeFile('brazil.shp');
 
 brazil.intersects()...

```


## qix format (*NEW format*)

* Structure of qix quadtree file.

```idl
Header {
    signature: char[3] = {"S","Q","T"},
    bOrder: char, // 0 - Native, 1 - Little Endian, 2 - Big Endian
    version: char, // mapserver write 1
    reserved: char[3], // mapserve use {0,0,0}
    numShapes: int32,
    maxDepth: int32
}
```


* Structure of qix node (record)

```idl
Node {
    offset: int32,
    xmin: double,
    ymin: double,
    xmax: double,
    ymax: double,
    numShapes: int32,
    ids: int32[numShapes],
    numSubNodes: int32
}
```