var tc = require('./util');

var context = tc.shapeFileContext,
expect = tc.expect;

describe('On br.shp', function() {

	before(tc.download([
		{
			url: 'https://copy.com/Y0KcopGoEBmfrFuT/Public/br.zip?download=1',
			name: 'br',
			test: 'br.shp'
		}
	]));



	describe('São João dos Patos / MA (-43.43312,-43.38103,-6.64456,-6.59436)', function() {

		geometry = tc.factory.toGeometry(tc.factory.envelope(-43.43312,-43.38103,-6.64456,-6.59436));
		context('br.shp', 'intersects', function(shapeFile, done) {


			var expectedCities = ['São João Dos Patos', 'Barão De Grajaú', 'Sucupira Do Riachão'].sort(),
			foundCities = [];

			var spy;

			shapeFile.intersects(geometry, spy = tc.sinon.spy(tc.throwAfter(function(err, feature) {
				expect(err).to.be.null;
				if (spy.callCount >= 4) {
					expect(feature).to.be.null;
					expect(foundCities.sort()).to.be.eql(expectedCities);
					done();
				} else {
					expect(feature).not.to.be.null;
					foundCities.push(feature.properties.NOME);
				}

			})));

		});
		
	});


	describe('Érico Cardoso / BA (-42.23482,-41.84175,-13.55158,-13.44922)', function() {

		var geometry = tc.factory.toGeometry(tc.factory.envelope(-42.23482,-41.84175,-13.55158,-13.44922));


		context('br.shp', 'intersects', function(shapeFile, done) {
			var spy;
			shapeFile.intersects(geometry, spy = tc.sinon.spy(tc.throwAfter(function(err, response) {
				/*if (err !== null)
					console.log(err.stack || err);*/
				expect(err).to.be.null;

				/*console.log('callCount = %d', spy.callCount);*/

				//console.log(response.properties.NOME);

				if (spy.callCount >= 5)
					done();
			})));

		});
	});


	describe('searchRecord', function() {

		context('br.shp', 'search Sertãozinho / SP', function(shapeFile, done) {
			function filter(record, index) {
				return record.GEOCODIGO === '3551702';
			}

			var spy;

			function iterator(err, feature, index) {
				if (spy.callCount === 1) {
					expect(feature.properties.NOME).to.eql('Sertãozinho');
					expect(err).to.be.null;
				} else if (spy.callCount === 2) {
					expect(err).to.be.not.exist;
					expect(feature).to.be.not.exist;
					expect(index).to.be.not.exist;
					done();
				}
			}

			shapeFile.searchRecord(filter, spy = tc.sinon.spy(tc.throwAfter(iterator)));
		});


		context('br.shp', 'search Lavras / MG with error', function(shapeFile, done) {

			var error = new Error('Unexpected error!');

			function filter(record, index) {
				if (record.GEOCODIGO === '3138203')
					throw error;

				return false;
			}

			var spy = tc.sinon.spy(tc.throwAfter(function(err, feature, index) {
				expect(err === error, 'Expected my unexpected exception \\o/').to.be.true;
				expect(feature).to.not.exist;
				expect(index).to.not.exist;
				done();
			}));


			shapeFile.searchRecord(filter, spy);

		});
	});


});