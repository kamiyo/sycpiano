var path = require('path');
var fs = require('fs');
var Webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./../../webpack.config.js');

module.exports = function() {
    // First we fire up Webpack an pass in the configuration we created.
    var bundleStart = null;
    var compiler = Webpack(webpackConfig);

    // We give notice in the terminal when it starts bundling and
    // set the time it started.
    compiler.plugin('compile', function() {
        console.log('Bundling...');
        bundleStart = Date.now();
    });

    // We also give notice when it is done compiling, including the
    // time it took. Nice to have
    compiler.plugin('done', function() {
        console.log('Bundled in ' + (Date.now() - bundleStart) + 'ms!');
    });

    var bundler = new WebpackDevServer(compiler, {
        // Tell Webpack to serve our bundled app from the build path.
        // When proxying: http://localhost:8000/build -> http://localhost:8080/build
        publicPath: '/build/',
        hot: true,

        // Terminal configs.
        quiet: false,
        noInfo: true,
        stats: {
            colors: true,
        }
    });

    bundler.listen(8080, 'localhost', function() {
        console.log('Bundling project...');
    });
}
