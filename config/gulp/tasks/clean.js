/**
* @Author: Alex Sorafumo <alex.sorafumo>
* @Date:   30/09/2016 3:02 PM
* @Email:  alex@yuion.net
* @Filename: clean.js
* @Last modified by:   alex.sorafumo
* @Last modified time: 24/01/2017 4:56 PM
*/

var gulp = require('gulp');
var config = require('../config')();
var del = require('del');

/* Run all clean tasks */
gulp.task('clean', ['clean:dist', 'clean:build']);

gulp.task('clean:build', function() {
    return del([
        '_build'
    ]);
});

gulp.task('clean:dist', function() {
    return del([
        'dist'
    ]);
});
