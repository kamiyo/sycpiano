// gulpfile.js
const nodemon = require('gulp-nodemon');
const gulp = require('gulp');
const fancyLog = require('fancy-log');
const PluginError = require('plugin-error');
const ts = require('gulp-typescript');
const eslint = require('gulp-eslint');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const cache = require('gulp-cached');
const del = require('del');
const generateTzData = require('./generateTzData');

const isProduction = process.env.NODE_ENV === 'production';

const webpackConfig = isProduction ? require('./webpack.prod.config.js') : require('./webpack.dev.config.js');
const tsProject = ts.createProject('server/tsconfig.json');
const serverLintCache = './.server-lint.json';

const buildApp = (done) => (
    webpack(webpackConfig, (err, stats) => {
        if (err || stats.hasErrors()) {
            fancyLog.error('[webpack]', err);
            fancyLog.error('[webpack][stats]', stats.errors);
        } else {
            fancyLog('[webpack]', stats.toString({
                chunks: false, // Makes the build much quieter
                colors: true,
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

const initCache = (done) => {
    fs.stat(serverLintCache, (err) => {
        if (!err) {
            cache.caches.eslint = require(serverLintCache) || {};
        }
        done();
    });
};

const saveLintCache = () => {
    const json = JSON.stringify(cache.caches.eslint);
    return new Promise((resolve, reject) => {
        fs.writeFile(serverLintCache, json, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    })
}

const cachedLint = () => {
    return tsProject.src()
        .pipe(cache('eslint', {
            optimizeMemory: true,
            cwd: __dirname,
        }))
        .pipe(eslint())
        .pipe(eslint.formatEach())
        .pipe(eslint.result(async result => {
            if (result.warningCount > 0 || result.errorCount > 0) {
                delete cache.caches.eslint[path.relative(__dirname, result.filePath)];
            }
            await saveLintCache();
        }));
};

const lintWatchServer = () => {
    const watcher = gulp.watch(
        'server/src/**/*.ts',
        {
            ignoreInitial: false,
            cwd: __dirname,
        },
        cachedLint
    );
    watcher.on('unlink', async (filePath) => {
        if (cache.caches.eslint) {
            delete cache.caches.eslint[path.relative(__dirname, filePath)];
        }
        await saveLintCache();
    });
    return watcher;
};

const compileServer = () => (
    tsProject.src()
        .pipe(tsProject())
        .js
        .pipe(gulp.dest('./server/build'))
);

const buildServer = gulp.series(
    // We don't need linting in production.
    cleanServer,
    compileServer,
);

gulp.task('build-server', buildServer);
gulp.task('lint-server', gulp.series(initCache, cachedLint));

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
    webpack(webpackConfig).watch({
        ignored: /node_modules/,
    }, (err, stats) => {
        if (err)
            throw new PluginError('webpack', err);

        fancyLog('[webpack]', stats.toString({
            chunks: false, // Makes the build much quieter
            colors: true,
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
    gulp.parallel(
        startNodemon,
        gulp.series(
            initCache,
            lintWatchServer,
        ),
    ),
));
