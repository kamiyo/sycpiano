/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');
const Minimizer = require('terser-webpack-plugin');
const webpack = require('webpack');
const os = require('os');

const config = merge(common.config, {
    mode: 'production',
    output: {
        filename: '[name].[chunkhash:8].bundle.js',
        chunkFilename: '[name].[chunkhash:8].chunk.js',
    },
    optimization: {
        minimizer: [new Minimizer({
            cache: true,
            parallel: true,
        })],
    },
    plugins: [
        new webpack.DefinePlugin({
            MUSIC_PATH: JSON.stringify(common.staticPrefix + '/music'),
        }),
    ],
});

module.exports = config;
