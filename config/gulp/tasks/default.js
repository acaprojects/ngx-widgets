/**
* @Author: Alex Sorafumo <alex.sorafumo>
* @Date:   30/09/2016 2:19 PM
* @Email:  alex@yuion.net
* @Filename: default.js
* @Last modified by:   alex.sorafumo
* @Last modified time: 24/01/2017 4:56 PM
*/

'use strict';

var gulp = require('gulp');
var del = require('del');
var exec = require('child_process').exec;
var clean = require('gulp-clean');

gulp.task('build',      ['webpack:dev']);
gulp.task('build:dev',  ['webpack:dev']);
gulp.task('build:prod', ['webpack:prod']);
gulp.task('test',       ['webpack:test']);
gulp.task('build:test', ['webpack:test']);

gulp.task('source', ['clean:build', 'clean:dist'], function () {
    return gulp.src(['./src/**', '!./src/**/*.scss'])
        .pipe(gulp.dest('./_build'));
});
gulp.task('source:dev', function () {
    return gulp.src(['./src/**', '!./src/**/*.scss'])
        .pipe(gulp.dest('./_build'));
});

gulp.task('dev:watch', function () {
    gulp.watch('./src/**', ['source:dev']);
    gulp.watch('./src/**/*.scss', ['sass:dev']);
});

gulp.task('ngc', ['inject:css+html'], function (cb) {
    return exec('./node_modules/.bin/ngc -p ./tsconfig.aot.json', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
        del(['./dist/**/*.ts']);
    });
});
