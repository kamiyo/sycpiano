/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');
const commonConfig = common.config;
const happyThreadPool = common.happyThreadPool;
const HappyPack = require('happypack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const config = merge(commonConfig, {
    devtool: 'inline-source-map',
    module: {
        loaders: [{
            test: /\.(t|j)sx?$/,
            loader: 'happypack/loader?id=stylelint',
            include: [
                path.resolve(__dirname, 'web/src'),
            ],
        }]
    },
    plugins: [
        new HappyPack({
            id: 'stylelint',
            threadPool: happyThreadPool,
            loaders: ['stylelint-custom-processor-loader'],
        }),
        new ForkTsCheckerWebpackPlugin({
            checkSyntacticErrors: true,
            tslint: path.resolve(__dirname, 'tslint.json'),
            watch: [
                path.resolve(__dirname, 'web/src'),
                path.resolve(__dirname, 'web/src/components'),
            ],
        }),
    ],
});

module.exports = config;