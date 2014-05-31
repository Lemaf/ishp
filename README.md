# ishp


A spatial indexed (qix quadtree) Shapefile reader


ishp uses qix quadtree, you can use [mapserver](http://mapserver.org/utilities/shptree.html) or [Quantum GIS](http://www.qgis.org/) to create a qix file.


```js

 var ishp = require('ishp');
 
 var brazil = new ishp.ShapeFile('brazil.shp');
 
 brazil.intersects()...

```