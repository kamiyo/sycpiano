/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const os = require('os');

const isProd = process.env.NODE_ENV === 'production';

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
                                '@babel/preset-react',
                                '@emotion/babel-preset-css-prop',
                                [
                                    '@babel/preset-env',
                                    {
                                        targets: "> 0.25%, not dead",
                                        useBuiltIns: 'usage',
                                    }
                                ],
                                '@babel/preset-typescript',
                            ],
                            plugins: [
                                'syntax-dynamic-import',
                                '@babel/proposal-class-properties',
                                '@babel/proposal-object-rest-spread',
                            ],
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
