var jsts = require('jsts');

var isCCW = jsts.algorithm.CGAlgorithms.isCCW;

var load = require('./polylineM').load;

function coordinate(point) {
	var coord = new jsts.geom.Coordinate(point[0], point[1]);
	coord.m = point[2];
	return coord;
}

function read(buffer, factory) {

	var content = load(buffer);

	var lines = content.lines.map(function(line) {
		return factory.createLinearRing(line.map(coordinate));
	});

	var shell = lines.shift(), holes = [], polygons = [];
	for (var i=0; i<lines.length; i++) {
		if (isCCW(lines[i])) {
			holes.push(lines[i]);
		} else {
			polygons.push(factory.createPolygon(shell, holes));
			holes = [];
			shell = lines[i];
		}
	}

	polygons.push(factory.createPolygon(shell, holes));
	
	var multiPolygon = new jsts.geom.MultiPolygon(polygons);
	multiPolygon.envelope = new jsts.geom.Envelope(content.box.xmin, content.box.xmax, content.box.ymin, content.box.ymax);

	return multiPolygon;
}

exports.read = read;