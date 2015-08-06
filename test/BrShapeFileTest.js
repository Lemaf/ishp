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

			function iterator(feature, index, next) {
				if (spy.callCount === 1) {
					expect(feature.properties.NOME).to.equal('Sertãozinho');
					expect(next).to.be.an.instanceOf(Function);
					expect(index).to.equal(2660);
					next();
				} else {
					throw new Error("Invalid callCount");
				}
			}

			function _done(err) {
				expect(err).to.not.exist;
				done();
			}

			shapeFile.searchRecord(filter, spy = tc.sinon.spy(tc.throwAfter(iterator)), tc.throwAfter(_done));
		});


		context('br.shp', 'search Lavras / MG with error', function(shapeFile, done) {

			var error = new Error('Unexpected error!');

			function filter(record, index) {
				if (record.GEOCODIGO === '3138203')
					throw error;

				return false;
			}

			function iterator(feature, index) {
				throw new Error("Ops!");
			}

			function _done(err) {
				expect(err === error, 'Expected my unexpected exception \\o/').to.be.true;
				done();
			}

			shapeFile.searchRecord(filter, tc.throwAfter(iterator), tc.throwAfter(_done));
		});


		context('br.shp', 'search Epitaciolândia / AC and Error in Brasília / DF', function(shapeFile, done) {

			var error = new Error("Brasília's problem");
			function filter(record, index) {
				if (index === 1515) {
					
					expect(record.NOME).to.equal('Brasília');
					expect(record.GEOCODIGO).to.equal('5300108');

					throw error;
				} else if (index === 1498) {

					expect(record.NOME).to.equal('Epitaciolândia');
					expect(record.GEOCODIGO).to.equal('1200252');

					return true;

				} else
					return false;
			}


			function iterator(feature, index, next) {
				expect(index).to.equal(1498);
				next();
			}

			function _done(err) {
				expect(err === error, 'Expected a problem in Brasília').to.be.true;
				done();
			}

			shapeFile.searchRecord(filter, tc.throwAfter(iterator), tc.throwAfter(_done));
		});

	});


});