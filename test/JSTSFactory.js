var jsts = require('jsts');

var factory = new jsts.geom.GeometryFactory();


function mkProxy(method) {
	return function() {
		return method.apply(factory, arguments);
	};
}

var prototype = Object.getPrototypeOf(factory);

for (var k in prototype) {
	if (typeof prototype[k] === 'function')
		exports[k] = mkProxy(prototype[k]);
}


exports.envelope = function(xmin, xmax, ymin, ymax) {
	return new jsts.geom.Envelope(xmin, xmax, ymin, ymax);
};