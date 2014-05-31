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
    char[3] signature = {"S","Q","T"},
    char bOrder,            // 0 - Native, 1 - Little Endian, 2 - Big Endian
    char version,           // mapserver write 1
    char[3] reserved,       // mapserve use {0,0,0}
    int32 numShapes,
    int32 maxDepth
}
```


* Structure of qix node (record)

```idl
Node {
    int32 offset,
    double xmin,
    double ymin,
    double xmax,
    double ymax,
    int32 numShapes,
    int32[numShapes] ids,
    int32 numSubNodes
}
```