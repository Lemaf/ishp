var tc = require('./testContext');

var context = tc.qixContext,
expect = tc.expect,
asc = tc.asc;

describe('Qix', function() {

	before(tc.download([
		{
			url: 'https://copy.com/yzHc6aQO76ko/shp.js/br.sp.zip?download=1',
			test: 'br.sp.shp',
			name: 'br.sp'
		}, {
			url: 'https://copy.com/yzHc6aQO76ko/shp.js/br.zip?download=1',
			test: 'br.shp',
			name: 'br'
		}
	]));

	context('br.sp.qix', 'Sertãozinho / SP (-48.01596,-47.95535,-21.14624,-21.09490)', function(qix, done) {

		this.timeout(0);
		var spy, foundIndexes = [], expectedIndexes = [106,185,229,276,284,356,408,441,448,487,553,576].sort(asc);
		
		qix.query(tc.factory.envelope(-48.01596,-47.95535,-21.14624,-21.09490), spy = tc.sinon.spy(tc.fix(function(err, index) {

			if (spy.callCount >= 13) {
				expect(err).to.be.null;
				expect(index).to.be.null;
				expect(foundIndexes.sort(asc)).to.eql(expectedIndexes);
				done();
			} else {
				expect(err).to.be.null;
				expect(index).to.be.gt(0);
				foundIndexes.push(index);
			}
		})));
	});


	context('br.qix', 'Érico Cardoso / BA (-42.23482,-41.84175,-13.55158,-13.44922)', tc.fix(function(qix, done) {
		var spy;

		var expectedIndexes = [
			71, 172, 305, 490,
			727, 777, 1010,1224,
			1537,1729,1772,1798,
			2023,2587,2807,2999,
			3030,3264,3812,3888,
			3981,3995,4052,4204,
			4212,4249,4326,4354,
			4477,4527,4616,4708,
			4718,5395],
		foundIndexes = [];

		qix.query(tc.factory.envelope(-42.23482,-41.84175,-13.55158,-13.44922), spy = tc.sinon.spy(function(err, index) {
			expect(err).to.be.null;

			if (spy.callCount >= 35) {
				expect(err).to.be.null;
				expect(index).to.be.null;
				expect(foundIndexes.sort(asc)).to.be.eql(expectedIndexes);
				done();
			} else {
				expect(err).to.be.null;
				expect(index).to.be.gte(0);
				foundIndexes.push(index);
			}
		}));
	}));


	context('br.qix', 'MA (-58.39654,-48.58000,-9.69570,0.01552)', function(qix, done) {
		var spy, indexes = [];

		qix.query(tc.factory.envelope(-58.39654,-48.58000,-9.69570,0.01552), spy = tc.sinon.spy(tc.fix(function(err, index) {
			if (spy.callCount >= 200) {
				done();
			} else {
				expect(err).to.be.null;
				expect(index).to.be.gte(0);
				indexes.push(index);
			}
		})));
	});

});