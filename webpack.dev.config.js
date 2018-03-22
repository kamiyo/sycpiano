/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const os = require('os');
const threadLoader = require('thread-loader');

const threadPoolSize = os.cpus().length - 1;

const workerPool = {
    workers: threadPoolSize,
    poolTimeout: Infinity,
};

const config = () => {
    threadLoader.warmup(workerPool, ['stylelint-custom-processor-loader']);

    return merge(common, {
        mode: 'development',
        devtool: 'inline-cheap-source-map',
        output: {
            filename: '[name].[chunkhash].bundle.js',
            chunkFilename: '[name].[chunkhash].chunk.js',
        },
        module: {
            rules: [{
                test: /\.(t|j)sx?$/,
                include: [
                    path.resolve(__dirname, 'web/src'),
                ],
                use: [
                    { loader: 'cache-loader' },
                    { loader: 'thread-loader' },
                    { loader: 'stylelint-custom-processor-loader' },
                ],
            }],
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin({
                checkSyntacticErrors: true,
                tslint: path.resolve(__dirname, 'tslint.json'),
                watch: [
                    path.resolve(__dirname, 'web/src'),
                ],
            }),
        ],
    });
}

module.exports = config();
