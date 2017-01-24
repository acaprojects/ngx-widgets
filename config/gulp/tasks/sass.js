/**
* @Author: Alex Sorafumo <alex.sorafumo>
* @Date:   30/09/2016 2:17 PM
* @Email:  alex@yuion.net
* @Filename: sass.js
* @Last modified by:   alex.sorafumo
* @Last modified time: 24/01/2017 4:56 PM
*/

'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', ['source'], function () {
    return gulp.src('./src/**/*.scss')
        .pipe(sass({outputStyle: 'compressed', includePaths: ['./src/app/shared/']}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./_build'));
});


gulp.task('sass:dev', function () {
    return gulp.src('./src/**/*.scss')
        .pipe(sass({outputStyle: 'compressed', includePaths: ['./src/app/shared/']}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./_build'));
});
