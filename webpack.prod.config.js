/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const os = require('os');

const config = merge(common.config, {
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
        new webpack.DefinePlugin({
            MUSIC_PATH: JSON.stringify(common.staticPrefix + '/music'),
        }),
    ],
});

module.exports = config;
