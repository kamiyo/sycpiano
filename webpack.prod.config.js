/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');
const UgilfyJSPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = merge(common, {
    devtool: 'source-map',
    plugins: [
        new UgilfyJSPlugin({
            test: /\.(t|j)sx?$/i,
            parallel: 4,
            sourceMap: true,
        }),
    ],
});

module.exports = config;
