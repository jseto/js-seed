'use strict';

var gulp = require('gulp');
var project = require('../project.conf.js');
var ts = require('gulp-typescript');
var merge = require('merge2');
var path = project.path;

var del = require('del');

gulp.task('clean', [ 'clean:coverage' ]);

gulp.task('clean:coverage', function(done){
	del( [ path.coverage + '**'], done );
});

var tsProject = ts.createProject({
    declarationFiles: true,
    noExternalResolve: true
});

gulp.task('ts', function(){
    var tsResult = gulp.src( path.client + '**/*.ts' ).pipe( ts( tsProject ) );

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done. 
        tsResult.dts.pipe( gulp.dest( path.tsDefinitions ) ),
        tsResult.js.pipe( gulp.dest( path.tsOut ) )
    ]);

});
