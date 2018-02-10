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

const isProduction = process.env.NODE_ENV === 'production';

const webpackConfig = isProduction ? require('./webpack.prod.config.js') : require('./webpack.dev.config.js');

const tsProject = ts.createProject('server/tsconfig.json');

const buildApp = () => (
    gulp.src('./web/src/main.tsx')
        .pipe(webpackStream(webpackConfig), webpack)
        .pipe(gulp.dest('./web/build'))
);

gulp.task('build-app', buildApp);

const cleanServer = () => (
    del([
        'server/build/**/*.js',
    ])
);

const lintServer = () => {
    const program = linter.Linter.createProgram("server/tsconfig.json");
    return gulp.src('server/src/**/*.ts')
        .pipe(tslint({
            formatter: 'stylish',
            program,
        }))
        .pipe(tslint.report({
            emitError: false,
        }));
};

const compileServer = () => (
    tsProject.src()
        .pipe(tsProject())
        .js
        .pipe(gulp.dest('./server/build'))
)

const buildServer = gulp.series(
    // We don't need linting in production.
    isProduction ? cleanServer : gulp.parallel(lintServer, cleanServer),
    compileServer
);

gulp.task('build-server', buildServer);

gulp.task(
    'build-prod',
    // We don't have enough memory in production to do build-server and build-app in parallel.
    (isProduction ? gulp.series : gulp.parallel)
        .call(this, 'build-server', 'build-app')
);

const webpackWatch = (done) => {
    webpack(webpackConfig).watch({}, (err, stats) => {
        if (err)
            throw new gutil.PluginError('webpack', err);

        gutil.log('[webpack]', stats.toString({
            chunks: false, // Makes the build much quieter
            colors: true
        }));
    });
    done();
}

const watchServer = (done) => {
    gulp.watch('server/src/**/*', buildServer);
    done();
}

const startNodemon = (done) => {
    nodemon({
        script: './app.js',
        watch: ['web/build', 'server/build/api-router.js', './app.js'],
    });
    done();
};

gulp.task('run-dev', gulp.series(
    gulp.parallel(
        gulp.series(
            buildServer,
            watchServer,
        ),
        webpackWatch,
    ),
    startNodemon,
));
