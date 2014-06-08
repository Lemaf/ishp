var load = require('./polylineM').load;

function read(record, buffer) {

	load(buffer);

}

exports.read = read;