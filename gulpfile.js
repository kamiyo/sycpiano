// gulpfile.js
const gulpNodemon = require('gulp-nodemon');
const gulp = require('gulp');
const fancyLog = require('fancy-log');
const PluginError = require('plugin-error');
const ts = require('gulp-typescript');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const del = require('del');
const generateTzData = require('./generateTzData');
const { Transform } = require('stream');
const { spawn } = require('child_process');
const treeKill = require('tree-kill');
const { MultiProgressBars } = require('multi-progress-bars');

let reporter;

const isProduction = process.env.NODE_ENV === 'production';

let ESLint, geslint, stylelint, stylelintFormatter, chalk, glob;

if (!isProduction) {
    ESLint = require('eslint');
    geslint = require('gulp-eslint');
    stylelint = require('stylelint');
    stylelintFormatter = require('stylelint-formatter-pretty');
    chalk = require('chalk');
    glob = require('glob');
}

const devWebpackConfig = isProduction ? () => {} : require('./webpack.dev.config.js');

const prodWebpackConfig = require('./webpack.prod.config.js');

const serverTsProject = ts.createProject('server/tsconfig.json');
const appTsProject = ts.createProject('tsconfig.json');

let finishResolve;

const finishPromise = new Promise((res, _) => {
    finishResolve = res;
});

const deferredReporter = (message) => {
    finishPromise.then(() => {
        console.log(message);
    });
};

const buildApp = (done) => (
    webpack(prodWebpackConfig, (err, stats) => {
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
            fancyLog('[webpack]', stats.toString('minimal'));
        }
        done();
    })
);

exports.buildApp = buildApp;

exports.generateTzData = generateTzData;

const cleanServer = async (done) => {
    await del([
        'server/build/**/*.js',
        '.resized-cache/*',
    ]);
    done();
};

const lintServer = () => {
    return gulp.src('server/src/**/*.ts')
        .pipe(geslint({
            configFile: 'server/.eslintrc.js',
            cache: true,
        }))
        .pipe(geslint.formatEach());
};

const compileServer = () => {
    return serverTsProject.src()
        .pipe(serverTsProject(ts.reporter.defaultReporter()))
        .on('error', () => { })
        .js
        .pipe(gulp.dest('./server/build'));
};

const checkServer = () => {
    return serverTsProject.src().pipe(serverTsProject(ts.reporter.defaultReporter()));
}

const compileServerNoCheck = () => {
    const count = glob.sync('server/src/**/*.ts').length;
    reporter.addTask('Compile Server', { type: 'percentage', barColorFn: chalk.blue, index: 1 });

    let counter = 0;
    const forEach = new Transform({
        writableObjectMode: true,
        readableObjectMode: true,
        transform(chunk, encoding, callback) {
            counter++;
            reporter.updateTask('Compile Server', { percentage: counter / count, message: counter + '/' + count });
            callback(null, chunk);
        }
    });

    return serverTsProject.src()
        .pipe(forEach)
        .pipe(serverTsProject(ts.reporter.nullReporter()))
        .on('error', () => { })
        .js
        .pipe(gulp.dest('./server/build'))
        .on('end', () => {
            reporter.done('Compile Server');
            // tscBar.increment(1, { message: 'Finished'.green });
        });
};

const buildServer = gulp.series(
    // We don't need linting in production.
    isProduction ? cleanServer : gulp.parallel(lintServer, cleanServer),
    compileServer
);

exports.buildServer = buildServer;

exports.buildProd = gulp.series(buildServer, generateTzData, buildApp);

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
    reporter.addTask('Webpack', { type: 'percentage', barColorFn: chalk.green, index: 2 });
    const compiler = webpack(devWebpackConfig(false, reporter));
    compiler.hooks.beforeRun.tapAsync('Reset Progress', (p) => {
        reporter.addTask('Webpack', { type: 'percentage', barColorFn: chalk.green, index: 2 });
        appPromise = new Promise((res, _) => appPromiseResolve = res);
    });

    webpackWatcher = compiler.watch({ ignored: /node_modules/ }, (err, stats) => {
        if (err)
            throw new PluginError('webpack', err);

        reporter.done('Webpack');

        // deferredReporter('[webpack]\n'.blue + stats.toString('minimal'));
        reporter.promise.then(() => {
            console.log(chalk.blue('[webpack]\n') + stats.toString('minimal'));
        });
    });

    done();
};

let webpackWatcher = null;

const webpackCompileNoCheck = (done) => {
    reporter.addTask('Webpack', { type: 'percentage', barColorFn: chalk.green, index: 2 });
    webpack(devWebpackConfig(false, reporter)).run((err, stats) => {
        if (err)
            throw new PluginError('webpack', err);

        reporter.done('Webpack');

        // deferredReporter('[webpack]\n'.blue + stats.toString('minimal'));
        reporter.promise.then(() => {
            console.log(chalk.blue('[webpack]\n') + stats.toString('minimal'));
        });
        done();
    });
};

const watchServer = (done) => {
    gulp.watch('server/src/**/*', { ignoreInitial: false }, buildServer);
    done();
};

const startNodemon = (done) => {
    gulpNodemon({
        script: './app.js',
        ext: 'js html',
        watch: [
            'web/build/',
            'server/build/',
            'app.js',
        ],
        done,
    });
};

exports.runDev = gulp.series(
    gulp.parallel(
        gulp.series(
            buildServer,
            watchServer,
        ),
        checkAndMakeBuildDir,
        webpackWatch,
    ),
    startNodemon,
);

exports.doServer = gulp.series(cleanServer, compileServerNoCheck);
exports.doApp = gulp.series(checkAndMakeBuildDir, webpackCompileNoCheck);

let appPromiseResolve, serverPromiseResolve;
let appPromise, serverPromise;

const resetServerPromise = (cb) => {
    serverPromise = new Promise((res, _) => serverPromiseResolve = res);
    cb();
};

const resetAppPromise = (cb) => {
    appPromise = new Promise((res, _) => appPromiseResolve = res);
    cb();
};

const resolveServerPromise = (cb) => {
    serverPromiseResolve();
    cb();
};

const resolveAppPromise = (cb) => {
    appPromiseResolve();
    cb();
};

process.on('SIGINT', () => {
    child && child.kill();
    webpackWatcher && webpackWatcher.close();
    watchers.forEach((watcher) => {
        watcher.close();
    });
    treeKill(process.pid);
});

let child;

const restartApp = async () => {
    try {
        reporter.addTask('Overall', { type: 'indefinite', barColorFn: chalk.white, index: 0 });
        reporter.updateTask('Overall', { message: 'Compiling' });
        mainDone && mainDone();
        await Promise.all([appPromise, serverPromise]);
        finishResolve();
        reporter.updateTask('Overall', { message: 'Starting App' });
        child && treeKill(child.pid);
        child = spawn('node', ['./app.js']);
        reporter.done('Overall', { message: chalk.yellow('Waiting for Changes...') });
        child.stdout.setEncoding('utf8');
        child.stderr.setEncoding('utf8');
        child.stdout.on('data', (data) => console.log(data));
        child.stderr.on('data', (data) => console.log(data));
    } catch (e) {
        console.error(e);
    }
}

let watchers = []

let mainDone;

// const watchDev = (done) => {
//     reporter = new MultiProgressBars({ initMessage: 'Watch Dev' });
//     watchers.push(
//         gulp.watch(
//             ['server/src/**/*'],
//             { ignoreInitial: false },
//             gulp.series(resetServerPromise, cleanServer, compileServerNoCheck, resolveServerPromise),
//         )
//     );
//     watchers.push(
//         gulp.watch(
//             ['web/src/**/*', 'web/partials/*'],
//             { ignoreInitial: false },
//             gulp.series(resetAppPromise, checkAndMakeBuildDir, webpackCompileNoCheck, resolveAppPromise),
//         )
//     );
//     watchers.push(
//         gulp.watch(
//             ['server/src/**/*', 'web/src/**/*', 'web/partials/*'],
//             { ignoreInitial: false },
//             restartApp,
//         )
//     );
//     mainDone = done;
// };

const watchDev = gulp.series((done) => {
    reporter = new MultiProgressBars({ initMessage: 'Watch Dev', border: true, anchor: 'bottom', persist: true });
    watchers.push(
        gulp.watch(
            ['server/src/**/*'],
            { ignoreInitial: false },
            gulp.series(resetServerPromise, cleanServer, compileServerNoCheck, resolveServerPromise),
        )
    );
    watchers.push(
        gulp.watch(
            ['server/src/**/*', 'web/src/**/*', 'web/partials/*'],
            { ignoreInitial: false },
            restartApp,
        )
    );
    mainDone = done;
}, webpackWatch);

exports.watchDev = watchDev;

const watchAndCheckServer = (done) => {
    gulp.watch('server/src/**/*', { ignoreInitial: false }, gulp.series(lintServer, checkServer));
    done();
};

const lintApp = async () => {
    const styleResult = await stylelint.lint({
        files: 'web/src/**/*',
        formatter: stylelintFormatter,
    });
    console.log(styleResult.output)

    const eslint = new ESLint();
    const results = await eslint.lintFiles(['web/src/**/*']);
    const formatter = await eslint.loadFormatter('stylish');
    const resultText = formatter.format(results);
    console.log(resultText);
};

const checkApp = () => {
    return appTsProject.src()
        .pipe(appTsProject(ts.reporter.defaultReporter()));
}

const watchAndCheckApp = (done) => {
    gulp.watch('web/src/**/*', { ignoreInitial: false }, gulp.series(lintApp, checkApp));
    done();
}

exports.watchAndCheckServer = watchAndCheckServer;
exports.watchAndCheckApp = watchAndCheckApp;