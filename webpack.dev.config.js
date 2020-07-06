/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
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
                    { loader: require.resolve('cache-loader') },
                    { loader: require.resolve('thread-loader') },
                    { loader: require.resolve('stylelint-custom-processor-loader') },
                ],
            }],
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin({
                eslint: {
                    files: './web/src/**/*.{ts,tsx,js,jsx}',
                },
            }),
            new webpack.DefinePlugin({
                MUSIC_PATH: JSON.stringify(common.staticPrefix + '/music_dev'),
                // Dev key from google console; make sure it's set in env or .env
                // Prod key is hardcoded since it is restricted. See webpack.prod.config.js
                GAPI_KEY: JSON.stringify(process.env.GAPI_KEY_APP),
            }),
            new BundleAnalyzerPlugin({
                openAnalyzer: false,
            }),
        ],
    });
}

module.exports = config();
