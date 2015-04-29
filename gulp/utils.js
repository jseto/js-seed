'use strict';

var gutil = require('gulp-util');
var project = require('../project.conf.js');
var pl = require('path');

module.exports = {
	printTaskName: function( name ) {
		return '[' + gutil.colors.blue( name ) + ']';
	},

	printTaskNameError: function( name ) {
		return '[' + gutil.colors.red( name ) + ']';
	},

	printChangedFiles: function( change, taskName ) {
		return this.printTaskName( taskName || 'watch:server' ) + ' ' +
			gutil.colors.cyan( 'File', change.type ) +  ' ' +
			gutil.colors.magenta( this.relPath( change.path ) );
	},

	relPath: function( path ){
		return pl.relative( project.path.base, path );
	}
};