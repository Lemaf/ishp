# ishp

---

[![Build Status](https://travis-ci.org/Lemaf/ishp.svg?branch=master)](https://travis-ci.org/Lemaf/ishp)
[![Dependency Status](https://david-dm.org/Lemaf/ishp.png)](https://david-dm.org/Lemaf/ishp)
[![devDependency Status](https://david-dm.org/Lemaf/ishp/dev-status.png)](https://david-dm.org/Lemaf/ishp#info=devDependencies)

A spatial indexed (qix file) Shapefile reader.

ishp uses qix quadtree file, you can use [mapserver](http://mapserver.org/utilities/shptree.html) or [QGIS](http://www.qgis.org/) to create a qix file.

* A little example:

```js
 var ishp = require('ishp');

 var brazil = new ishp.ShapeFile('brazil.shp');

 brazil.intersects(geometry, function(err, feature) {
   if (err)
    console.log(err);
   else {
    console.log(feature.properties);
   }
 })...

```

# [References](https://github.com/Lemaf/ishp/wiki)
* [ShapeFile](https://github.com/Lemaf/ishp/wiki/ShapeFile-Reference)
* [Qix format](https://github.com/Lemaf/ishp/wiki/Qix-Format)
