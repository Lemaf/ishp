var download = require('download');
var url = require('url');
var path = require('path');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;

var eachAsync = require('each-async');
var decompress = require('decompress');

module.exports = function(urls, dest, extract) {

	urls = Array.isArray(urls) ? urls : [urls];

	urls = urls.filter(function(url) {

		var basename = path.basename(url);

		return !fs.existsSync(path.join(dest, basename));

	}).map(function(downloadURL) {
		return {
			url: downloadURL,
			name: path.basename(url.parse(downloadURL).pathname)
		};
	});


	var map = urls.reduce(function(map, url) {
		map[url.url] = url;
		return map;
	}, {});

	var ret = new EventEmitter();
	if (urls.length) {

		var downloader = download(urls, dest, {
			extract: false,
			strip: true
		}).on('response', function(message) {

			map[message.request.href].contentType = message.headers['content-type'];
			console.log('Downloading...' + message.request.href);

		}).on('close', function(err) {

			if (extract) {
				eachAsync(urls, function(downloaded, index, done) {
					var ext = path.extname(downloaded.name);

					var localDest = path.join(dest, path.basename(downloaded.name, ext));

					console.log('Extracting ' + path.join(dest, downloaded.name) + ' to ' + localDest);

					if (decompress.canExtract(downloaded.contentType)) {

						fs.createReadStream(path.join(dest, downloaded.name)).pipe(decompress({
							path: localDest,
							ext: downloaded.contentType
						})).on('close', function() {
							done();
						}).on('error', function(err) {
							console.error(err);
							done();
						});
					}

				}, function() {
					ret.emit('ready');
				});
				
			} else
				ret.emit('ready');

		});

	} else {
		setTimeout(function() {
			ret.emit('ready');
		});
	}
	return ret;

};