var gulp = require('gulp');
var config = require('../config')();
var del = require('del');

/* Run all clean tasks */
gulp.task('clean', ['clean:dist', 'clean:build']);

gulp.task('clean:build', function() {
    return del([
        '.build'
    ]);
});

gulp.task('clean:dist', function() {
    return del([
        'dist'
    ]);
});
