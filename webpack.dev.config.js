/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.config.js');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackBar = require('webpackbar');

const config = (shouldCheck, reporter) => {
    const tsxUse = common.tsxUse;
    if (shouldCheck) {
        tsxUse.push({ loader: require.resolve('stylelint-custom-processor-loader') });
    }

    const plugins = [
        new webpack.DefinePlugin({
            MUSIC_PATH: JSON.stringify(common.staticPrefix + '/music_dev'),
            // Dev key from google console; make sure it's set in env or .env
            // Prod key is hardcoded since it is restricted. See webpack.prod.config.js
            GAPI_KEY: JSON.stringify(process.env.GAPI_KEY_APP),
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            logLevel: 'silent',
        }),
        new webpack.ProgressPlugin({
            handler: (percentage, message, ...args) => {
                const msg = message
                    ? message +
                        ((args.length) ? ': ' + args[0] : '')
                    : '';
                reporter.updateTask('Webpack', { percentage, message: msg });
            },
        }),
    ];

    if (shouldCheck) {
        plugins.push(
            new ForkTsCheckerWebpackPlugin({
                eslint: {
                    files: './web/src/**/*.{ts,tsx,js,jsx}',
                },
            })
        );
    }

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
                include: common.sourcePaths,
                use: tsxUse,
            }],
        },
        plugins,
    });
}

module.exports = config;
