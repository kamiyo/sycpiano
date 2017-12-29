// gulpfile.js

const nodemon = require('gulp-nodemon');
const gulp = require('gulp');
const gutil = require('gulp-util');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');
const webpack = require('webpack');
const del = require('del');
const webpackStream = require('webpack-stream');
const webpackConfig = (process.env.NODE_ENV === 'production') ? require('./webpack.prod.config.js') : require('./webpack.dev.config.js');

const tsProject = ts.createProject('server/tsconfig.json');

gulp.task('build', () => {
    // src is overwritten by webpack entry points
    return gulp.src('./web/src/main.tsx')
        .pipe(webpackStream(webpackConfig), webpack)
        .pipe(gulp.dest('./web/build'));
});

gulp.task('clean-server', () => {
    return del([
        'server/build/**/*.js',
    ]);
});

gulp.task('lint-server', () => {
    return gulp.src('server/src/**/*.ts')
        .pipe(tslint({
            configuration: 'server/tsconfig.json',
        }))
        .pipe(tslint.report());
});

gulp.task('build-server', ['clean-server'], () => {
    return tsProject.src()
        .pipe(tsProject()).js.pipe(gulp.dest("./server/build"));
});

gulp.task('build-prod', ['build-server', 'build']);

gulp.task('run-dev', ['watch-dev', 'watch'], () => {
    return nodemon({
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

gulp.task('watch-dev', ['build-server'], () => {
    return gulp.watch('server/src/**/*', ['build-server']);
});