var gulp = require('gulp');
var gulpSolemn = require('gulp-solemn');

var gulpSolemnCss = gulpSolemn('css');
var gulpSolemnJs = gulpSolemn('js');

var gulpSolemnCssWithDictionary = gulpSolemn('css', ['test/fixtures/dictionary1.json', 'test/fixtures/dictionary2.json']);
var gulpSolemnJsWithDictionary = gulpSolemn('js', ['test/fixtures/dictionary1.json', 'test/fixtures/dictionary2.json']);

gulp.src('test/fixtures/*.js')
    .pipe(gulpSolemnJs)

gulp.src('test/fixtures/*.css')
    .pipe(gulpSolemnCss)

gulp.src('test/fixtures/*.js')
    .pipe(gulpSolemnJsWithDictionary)

gulp.src('test/fixtures/*.css')
    .pipe(gulpSolemnCssWithDictionary)
