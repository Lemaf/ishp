module.exports = function(grunt) {

	grunt.initConfig({
		jsdox: {
			generate: {
				options: {
					contentsEnabled: true,
					contentsTitle: 'iShp - A indexed ShapeFile Reader',
					pathFilter: /^lib/
				},

				src: ['lib/**/*.js'],
				dest: 'docs/'
			}
		}
	});

	grunt.loadNpmTasks('grunt-jsdox');

};