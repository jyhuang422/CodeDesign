var gulp = require('gulp');
var webpack = require('webpack-stream');
var plumber = require('gulp-plumber');


var wp_compile = function(ifWatch = false) {
    var config = Object.assign({}, require('./webpack.config.js'), ifWatch ? {watch: true, devtool: 'inline-source-map'} : {});

    return gulp.src('src/index.js')
            .pipe(plumber())
            .pipe(webpack(config))
            .pipe(gulp.dest('dist/assets'));
};

gulp.task('webpack', function() {
    wp_compile();
});

gulp.task('webpack::watch', function() {
    wp_compile(true);
});

gulp.task('default', ['webpack'], function() {});
gulp.task('watch', ['webpack::watch'], function() {});