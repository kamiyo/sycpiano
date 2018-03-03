/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');
const commonConfig = common.config;
const UgilfyJSPlugin = require('uglifyjs-webpack-plugin');

const config = merge(commonConfig, {
    plugins: [
        new UgilfyJSPlugin({
            test: /\.(t|j)sx?$/i,
            parallel: 4,
            sourceMap: true,
        }),
    ],
});

module.exports = config;
