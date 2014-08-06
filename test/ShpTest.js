var tc = require('./testContext');
var expect = tc.expect;


function context(file, description, fn) {
	var Shp = require('../lib/Shp');
	var Shx = require('../lib/Shx');
	var shp = new Shp();
}

describe('Shp ', function() {

	before(tc.download([
		{
			url: 'https://copy.com/yzHc6aQO76ko/shp.js/br.mg.zip?download=1',
			name: 'br.mg',
			test: 'br.mg.shp'
		}
	]));




});