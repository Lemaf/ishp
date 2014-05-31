var download = require('download'),
each = require('each-async'),
path = require('path'),
existsSync = require('fs').existsSync;

var dest = path.join(__dirname, 'data');


module.exports = function(downloads) {

	if (!Array.isArray(downloads))
		downloads = [downloads];



	return function(done) {

		this.timeout(10 * 1000 * 60);

		each(downloads, function(source, index, next) {

			if (existsSync(path.join(dest, source.test)))
				next();
			else {
				console.log('downloading %s', source.name);
				download(source, dest, {extract: true})
					.on('error', function(err) {
						next(err);
					})
					.on('close', function() {
						next();
					})
				;
			}
		}, function(err) {
			done(err);
		});
	};

};