/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const config = merge(common, {
    devtool: 'inline-source-map',
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            checkSyntacticErrors: true,
            tslint: path.resolve(__dirname, 'tslint.json'),
            watch: [
                path.resolve(__dirname, 'web/src'),
                path.resolve(__dirname, 'web/src/components'),
                path.resolve(__dirname, 'web/src/admin'),
                path.resolve(__dirname, 'web/src/admin/components'),
            ],
        }),
    ],
});

module.exports = config;