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
        .pipe(gulp.dest('./.build'));
});


gulp.task('sass:dev', function () {
    return gulp.src('./src/**/*.scss')
        .pipe(sass({outputStyle: 'compressed', includePaths: ['./src/app/shared/']}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./.build'));
});
