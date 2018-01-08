// gulpfile.js

const nodemon = require('gulp-nodemon');
const gulp = require('gulp');
const gutil = require('gulp-util');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');
const linter = require('tslint');
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
    const program = linter.Linter.createProgram("server/tsconfig.json");

    return gulp.src('server/src/**/*.ts')
        .pipe(tslint({
            formatter: 'stylish',
            program,
        }))
        .pipe(tslint.report({
            emitError: false,
        }));
});

gulp.task('compile-server', () => {
    return tsProject.src()
        .pipe(tsProject()).js.pipe(gulp.dest("./server/build"));
})

const buildServer = gulp.series(gulp.parallel('lint-server', 'clean-server'), 'compile-server');

gulp.task('build-server', buildServer);

gulp.task('build-prod', gulp.parallel('build-server', 'build'));

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

gulp.task('watch-server', () => {
    return gulp.watch('server/src/**/*', buildServer);
})

gulp.task('build-and-watch-server', gulp.series('build-server', 'watch-server'));

gulp.task('start-watches', gulp.parallel('build-and-watch-server', 'watch'));

gulp.task('start-nodemon', () => {
    return nodemon({
        script: './app.js',
        watch: ['web/build', 'server/build/api-router.js'],
    });
})

gulp.task('run-dev', gulp.series('start-watches', 'start-nodemon'));
