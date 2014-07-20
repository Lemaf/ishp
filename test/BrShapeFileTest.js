var download = require('./download');

describe('On br.shp', function() {

	before(download([
		{
			url: 'https://copy.com/yzHc6aQO76ko/shp.js/br.zip?download=1',
			name: 'br',
			test: 'br.shp'
		}
	]));



	describe('test', function() {

		it('t', function() {

		});
	});

});