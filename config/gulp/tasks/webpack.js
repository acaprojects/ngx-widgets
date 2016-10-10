'use strict';

var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");

var webpack_config_dev = require('../../webpack/webpack.dev.js')({env: 'development'});
var webpack_config_prod = require('../../webpack/webpack.prod.js')({env: 'production'});
var webpack_config_test = require('../../webpack/webpack.test.js')({env: 'testing'});

gulp.task('webpack:dev', ['source', 'sass'], function() {
    return gulp.src(['./.build/**']).pipe(gulp.dest('./dist'));
});

gulp.task('webpack:prod', ['ngc'], function() {
        //Copy compiled source to dist
    gulp.src(['./.build/compiled/.build/**', './.build/**/*.html', './.build/**/*.css']).pipe(gulp.dest('./dist/.build'));
        //Copy project metadata and readme to the folder
    gulp.src(['./package.json', './README.md', './.build/compiled/index.*']).pipe(gulp.dest('./dist'));
});
