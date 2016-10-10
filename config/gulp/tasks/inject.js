'use strict';

var gulp = require('gulp');
var injectfile = require("gulp-inject-file");
var replace = require('gulp-replace');

// using: regex, capture groups, and capture group variables.
var templateUrlRegex = /templateUrl *:(.*)$/gm;
var stylesRegex = /styleUrls *:(\s*\[[^\]]*?\])/g;
var stringRegex = /(['"])((?:[^\\]\\\1|.)*?)\1/g;

function replaceStringsWithRequires(string) {
    return string.replace(stringRegex, function (match, quote, url) {
        if (url.charAt(0) !== ".") {
            url = "./" + url;
        }
        return "`<!-- inject:" + url + "-->`";
    });
}

gulp.task('inject:css+html', ['source', 'sass'], function() {
    gulp.src(['./.build/**/*.ts'])
    .pipe(replace(templateUrlRegex, function (match, url) {
        // replace: templateUrl: './path/to/template.html'
        // with: template: require('./path/to/template.html')
        return "template:" + replaceStringsWithRequires(url);
    }))
    .pipe(replace(stylesRegex, function (match, url) {
        // replace: styleUrls: './path/to/styles.css'
        // with: style: require('./path/to/styles.css')
        return "styles:" + replaceStringsWithRequires(url);
    }))
    .pipe(injectfile())
    .pipe(gulp.dest('./.build'));
});
