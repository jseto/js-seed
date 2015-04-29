'use strict';

var gulp = require('gulp');
var project = require('../project.conf.js');
var ts = require('gulp-typescript');
var merge = require('merge2');
var utils = require('./utils.js');
var path = project.path;

var del = require('del');

gulp.task('clean', [ 'clean:coverage', 'clean:ts' ]);

gulp.task('clean:coverage', function(done){
	del( [ path.coverage + '**'], done );
});

var tsProject = ts.createProject({
    declarationFiles: true,
    noExternalResolve: true
});

var _ts = function(){
    var tsResult = gulp.src( path.client + '**/*.ts' ).pipe( ts( tsProject ) );

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done. 
        tsResult.dts.pipe( gulp.dest( path.customTsd ) ),
        tsResult.js.pipe( gulp.dest( path.tsOut ) )
    ]);

};

gulp.task('ts', _ts );

gulp.task('watch:ts', ['ts'], function(){
	gulp.watch(	project.watch.typescriptFiles, function( data ){
		console.log( utils.printChangedFiles( data, 'watch:ts' ) );
		console.log( utils.printTaskName('watch:ts') + ' Transpiled' );
		_ts();
	});
});

gulp.task('clean:ts', function( done ){
	del( [
		path.customTsd + '**',
		path.tsOut + '**'	
	], done )
});
