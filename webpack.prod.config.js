/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const os = require('os');

const config = merge(common, {
    mode: 'production',
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js',
    },
    plugins: [
        new UglifyJsPlugin({
            uglifyOptions: {
                ecma: 6,
            },
        }),
    ],
});

module.exports = config;
