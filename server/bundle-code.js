const path = require('path');
const httpProxy = require('http-proxy');
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./../webpack.config.js');
const express = require('express');

module.exports = {};

module.exports.bundleCode = () => {
    // First we fire up Webpack and pass in the configuration we created.
    let bundleStart = null;
    const compiler = Webpack(webpackConfig);

    // We give notice in the terminal when it starts bundling and
    // set the time it started.
    compiler.plugin('compile', () => {
        console.log('Bundling...');
        bundleStart = Date.now();
    });

    // We also give notice when it is done compiling, including the
    // time it took. Nice to have
    compiler.plugin('done', () => {
        console.log(`Bundled in ${Date.now() - bundleStart} ms!`);
    });

    const bundler = new WebpackDevServer(compiler, {
        // Tell Webpack to serve our bundled app from the build path.
        // When proxying: http://localhost:8000/build -> http://localhost:8080/build
        publicPath: '/build/',
        hot: true,

        // Terminal configs.
        quiet: false,
        noInfo: true,
        stats: { colors: true }
    });

    bundler.listen(8080, 'localhost', () => console.log('Bundling project...'));
};

const router = express.Router();
const proxy = httpProxy.createProxyServer();

// Catch any errors from the proxy in order to not crash the server.
// Example: connecting to server when webpack is building.
proxy.on('error', e => {
    console.log('Could not connect to proxy, please try again...');
});

// We want to proxy any requests sent to localhost:8000/build
// to the webpack-dev-server.
router.all('/build/*', (req, res) => {
    proxy.web(req, res, { target: 'http://localhost:8080/' });
});

module.exports.router = router;
