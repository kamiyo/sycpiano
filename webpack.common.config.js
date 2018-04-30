/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const os = require('os');
const threadLoader = require('thread-loader');

const isProd = process.env.NODE_ENV === 'production';

// Heroku's free plan is strict about memory usage, so we'll use one on prod.
// On Dev, keep one cpu for fork-ts
const threadPoolSize = isProd ? 1 : os.cpus().length - 1;

const staticPrefix = '/static';

const sourcePaths = [
    path.resolve(__dirname, 'web/src'),
];

const workerPool = {
    workers: threadPoolSize,
    poolTimeout: isProd ? 2000 : Infinity,
};

const config = () => {
    return {
        cache: true,
        entry: {
            sycpiano: path.resolve(__dirname, 'web/src/main.tsx'),
        },
        output: {
            path: path.resolve(__dirname, 'web/build'),
            publicPath: '/static/',
        },
        module: {
            rules: [{
                test: /\.(t|j)sx?$/,
                include: sourcePaths,
                use: [
                    { loader: 'cache-loader' },
                    {
                        loader: 'thread-loader',
                        options: workerPool,
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['env', {
                                    target: {
                                        chrome: 41,
                                    },
                                    modules: false,
                                }],
                            ],
                            plugins: [
                                ['emotion',
                                    {
                                        sourceMap: true,
                                        hoist: true,
                                        autoLabel: true,
                                    },
                                ],
                                'syntax-dynamic-import',
                            ],
                        },
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            happyPackMode: true,
                        },
                    },
                ]
            }, {
                test: /\.(ttf|eot|woff|woff2|svg|png|jpg)$/,
                include: [
                    path.resolve(__dirname, 'web/assets/images'),
                    path.resolve(__dirname, 'web/assets/fonts')
                ],
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 2e16,
                            name: '[name]-[hash].[ext]',
                        },
                    },
                ],
            }]
        },
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
            },
        },
        plugins: [
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /^en$/),
            new webpack.DefinePlugin({
                BINARY_PATH: JSON.stringify(staticPrefix + '/binary'),
                IMAGES_PATH: JSON.stringify(staticPrefix + '/images'),
                // MUSIC_PATH: JSON.stringify(staticPrefix + '/music'), => see dev and prod files
                VIDEOS_PATH: JSON.stringify(staticPrefix + '/videos'),
            }),
            new CleanWebpackPlugin([path.resolve(__dirname, 'web/build/*')]),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'web/partials/index.html'),
                inject: false,
            }),
            new ProgressBarPlugin({
                format: '[:percent] webpack: :msg... :elapseds \n',
                clear: false,
            }),
        ],
        resolve: {
            extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
            alias: {
                'src': path.resolve(__dirname, 'web/src'),
            },
            symlinks: false,
        }
    }
};

module.exports = {
    config: config(),
    staticPrefix,
};
