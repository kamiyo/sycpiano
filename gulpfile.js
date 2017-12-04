// gulpfile.js

const nodemon = require('nodemon');
const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = (process.env.NODE_ENV === 'production') ? require('./webpack.prod.config.js') : require('./webpack.dev.config.js');

gulp.task('build', () => {
    // src is overwritten by webpack entry points
    gulp.src('./web/src/main.jsx')
        .pipe(webpackStream(webpackConfig), webpack)
        .pipe(gulp.dest('./web/build'));
});

gulp.task('run', ['watch'], () => {
    nodemon({
        script: './app.js',
        ignore: ['*'],
        watch: ['foo/'],
        ext: 'noop'
    });
});

gulp.task('watch', () => {
    webpack(webpackConfig).watch({}, (err, stats) => {
        if (err)
            throw new gutil.PluginError('webpack', err);

        gutil.log('[webpack]', stats.toString({
            chunks: false, // Makes the build much quieter
            colors: true
        }));
    });
});

gulp.task('dev', ['watch', 'server']);