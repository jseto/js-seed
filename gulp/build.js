/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/gulp/gulp.d.ts" />

'use strict';

var gulp = require('gulp');
var project = require('../project.conf.js');
var ts = require('gulp-typescript');
var merge = require('merge2');
var dirname = require('path').dirname;
var utils = require('./utils.js');
var sourcemaps = require('gulp-sourcemaps');
var path = project.path;

var del = require('del');

gulp.task('clean', [ 'clean:coverage', 'clean:ts' ]);

gulp.task('clean:coverage', function(done){
	del( [ path.coverage + '**'], done );
});

var tsImpl = function(){
    var tsResult = gulp.src([
		path.client + '**/*.ts',
//		path.typeDefinitions + '**/*.d.ts',
	])
	.pipe(sourcemaps.init())
    .pipe( ts({
		declarationFiles: true,
		target: 'ES5'
	}));

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done.
//        tsResult.dts.pipe( gulp.dest( path.customTsd ) ),
        tsResult.js
			.pipe( sourcemaps.write() )
			.pipe( gulp.dest( path.outputFiles ) )
    ]);
};

var tsTest = function(){
    var tsResult = gulp.src([
		path.test.base + '**/*.ts',
//		path.typeDefinitions + '**/*.d.ts',
	])
	.pipe(sourcemaps.init())
    .pipe( ts({
		target: 'ES5'
	}) );

    return tsResult.js
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest( path.test.outputFiles ) );
};

var tsFile = function( filePath ) {
	var isTestFile = filePath.indexOf( path.test.base ) >= 0;

	return gulp.src( filePath )
				.pipe(sourcemaps.init())
				.pipe( ts({
					declarationFiles: !isTestFile,
					target: 'ES5'
				}) )
				.pipe( sourcemaps.write() )
				.pipe( gulp.dest( outPath() ) );

	function outPath() {
		if ( isTestFile ){
			return path.test.outputFiles + dirname( filePath.slice( path.test.base.length ) );
		}
		else {
			return path.outputFiles + dirname( filePath.slice( path.client.length ) );
		}
	};
};

gulp.task( 'ts:impl', tsImpl );
gulp.task( 'ts:test', tsTest );
gulp.task('ts', ['ts:impl', 'ts:test'] );

gulp.task('watch:ts', ['ts'], function(){
	gulp.watch(	project.watch.typescriptFiles, function( data ){
		console.log( utils.printChangedFiles( data, 'watch:ts' ) );
		console.log( utils.printTaskName('watch:ts') + ' Transpiled' );
		tsFile( data.path );
	});
});

gulp.task('clean:ts', function( done ){
	del( [
		path.customTsd + '**',
		path.outputFiles + '**',
		path.test.outputFiles + '**'
	], done )
});
