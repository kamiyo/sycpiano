// gulpfile.js
const nodemon = require('gulp-nodemon');
const gulp = require('gulp');
const fancyLog = require('fancy-log');
const PluginError = require('plugin-error');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');
const linter = require('tslint');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const del = require('del');
const generateTzData = require('./generateTzData');

const isProduction = process.env.NODE_ENV === 'production';

const webpackConfig = isProduction ? require('./webpack.prod.config.js') : require('./webpack.dev.config.js');

const tsProject = ts.createProject('server/tsconfig.json');

const buildApp = (done) => (
    webpack(webpackConfig, (err, stats) => {
        if (err || stats.hasErrors()) {
            if (err) {
                fancyLog.error('[webpack]', err.stack || err);
                if (err.details) {
                    fancyLog.error('[webpack]', err.details);
                }
            }

            const info = stats.toJson();

            if (stats.hasErrors()) {
                fancyLog.error('[webpack][stats]', info.errors);
            }

            if (stats.hasWarnings()) {
                fancyLog.warn('[webpack][stats]', info.warnings);
            }
        }
        else {
            fancyLog('[webpack]', stats.toString({
                chunks: false, // Makes the build much quieter
                colors: true
            }));
        }
        done();
    })
);

gulp.task('build-app', buildApp);

gulp.task('generate-tz-data', generateTzData);

const cleanServer = async (done) => {
    await del([
        'server/build/**/*.js',
        '.resized-cache/*',
    ]);
    done();
};

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
);

const buildServer = gulp.series(
    // We don't need linting in production.
    isProduction ? cleanServer : gulp.parallel(lintServer, cleanServer),
    compileServer
);

gulp.task('build-server', buildServer);

gulp.task(
    'build-prod',
    // We don't have enough memory in production to do build-server and build-app in parallel.
    gulp.series('build-server', 'generate-tz-data', 'build-app')
);

// build folder needs to exist when nodemon watch is called
const checkAndMakeBuildDir = (done) => {
    const buildDir = path.resolve(__dirname, 'web/build');
    fs.exists(buildDir, (exists) => {
        if (!exists) {
            fs.mkdir(buildDir, (err) => {
                if (err) {
                    console.log(err);
                }
                done();
            });
        } else {
            done();
        }
    });
}

const webpackWatch = (done) => {
    webpack(webpackConfig).watch({}, (err, stats) => {
        if (err)
            throw new PluginError('webpack', err);

        fancyLog('[webpack]', stats.toString({
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
        ext: 'js html',
        watch: [
            'web/build/',
            'server/build/api-router.js',
            'app.js',
        ],
    });
    done();
};

gulp.task('run-dev', gulp.series(
    gulp.parallel(
        gulp.series(
            buildServer,
            watchServer,
        ),
        checkAndMakeBuildDir,
        webpackWatch,
    ),
    startNodemon,
));
