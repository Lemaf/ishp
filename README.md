# ishp


A spatial indexed (qix quadtree) Shapefile reader


ishp uses qix quadtree, you can use [mapserver](http://mapserver.org/utilities/shptree.html) or [Quantum GIS](http://www.qgis.org/) to create a qix file.


```js

 var ishp = require('ishp');
 
 var brazil = new ishp.ShapeFile('brazil.shp');
 
 brazil.intersects()...

```


## qix format (*NEW format*)

* [Reference](https://github.com/mapserver/mapserver/blob/master/maptree.c)

* Structure of qix quadtree file.

```c
Header {
    char signature[3] = {"S","Q","T"},
    char bOrder,            // 0 - Native, 1 - Little Endian, 2 - Big Endian
    char version,           // mapserver write 1
    char reserved[3],       // mapserve use {0,0,0}
    int numShapes,
    int maxDepth
}
```


* Structure of qix node (record)

```c
Node {
    int offset,
    double xmin,
    double ymin,
    double xmax,
    double ymax,
    int numShapes,
    int ids[numShapes],
    int numSubNodes
}
```

