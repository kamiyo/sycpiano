// gulpfile.js

const nodemon = require('gulp-nodemon');
const gulp = require('gulp');
const gutil = require('gulp-util');
const ts = require('gulp-typescript');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = (process.env.NODE_ENV === 'production') ? require('./webpack.prod.config.js') : require('./webpack.dev.config.js');

gulp.task('build', () => {
    // src is overwritten by webpack entry points
    return gulp.src('./web/src/main.tsx')
        .pipe(webpackStream(webpackConfig), webpack)
        .pipe(gulp.dest('./web/build'));
});

gulp.task('build-server', () => {
    const tsProject = ts.createProject('server/tsconfig.json');
    return tsProject.src()
        .pipe(tsProject()).js.pipe(gulp.dest("./server/build"));
});

gulp.task('build-prod', ['build-server', 'build']);

gulp.task('run-dev', ['watch-dev', 'watch'], () => {
    nodemon({
        script: './app.js',
        watch: ['web/build', 'server/build/api-router.js'],
    });
});

gulp.task('watch', () => {
    return webpack(webpackConfig).watch({}, (err, stats) => {
        if (err)
            throw new gutil.PluginError('webpack', err);

        gutil.log('[webpack]', stats.toString({
            chunks: false, // Makes the build much quieter
            colors: true
        }));
    });
});

gulp.task('watch-dev', () => {
    return gulp.watch('server/src/*', ['build-server']);
});