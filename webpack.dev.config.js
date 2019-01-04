/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const os = require('os');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = () => {
    return merge(common.config, {
        mode: 'development',
        devtool: 'inline-cheap-source-map',
        output: {
            filename: '[name].bundle.js',
            chunkFilename: '[name].chunk.js',
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
            new webpack.DefinePlugin({
                MUSIC_PATH: JSON.stringify(common.staticPrefix + '/music_dev'),
            }),
            new BundleAnalyzerPlugin({
                openAnalyzer: false,
            }),
        ],
    });
}

module.exports = config();
