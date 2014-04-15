var fsExt = require('fs-ext');
var fs = require('fs');
var convertNodeAsyncFunction = require('promised-io').convertNodeAsyncFunction;


for (var m in fsExt) {
	if (m.match(/Sync$/) || m.match(/watch/))
		exports[m] = fsExt[m];
	else
		exports[m] = convertNodeAsyncFunction(fsExt[m], false);
}