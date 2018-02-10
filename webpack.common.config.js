/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HappyPack = require('happypack');
const path = require('path');
const webpack = require('webpack');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

// Heroku's free plan is strict about memory usage, so we'll use one on prod.
const threadPoolSize = process.env.NODE_ENV === 'production' ? 1 : 6;

const happyThreadPool = HappyPack.ThreadPool({ size: threadPoolSize });

const staticPrefix = '/static';

const sourcePaths = [
    path.resolve(__dirname, 'web/src'),
    path.resolve(__dirname, 'web/src/components'),
    path.resolve(__dirname, 'web/src/styles'),
];

const config = {
    cache: true,
    entry: {
        sycpiano: path.resolve(__dirname, 'web/src/main.tsx'),
    },
    output: {
        path: path.resolve(__dirname, 'web/build'),
        filename: '[name].bundle.js',
    },
    module: {
        loaders: [{
            test: /\.(t|j)sx?$/,
            include: sourcePaths,
            loader: 'happypack/loader?id=ts'
        }, {
            loader: 'happypack/loader?id=style',
            test: /\.(css|less)$/,
            include: [
                path.resolve(__dirname, 'web/less'),
            ],
        }, {
            loader: 'happypack/loader?id=url',
            test: /\.(ttf|eot|woff|woff2|svg|png|jpg)$/,
            include: [
                path.resolve(__dirname, 'web/assets/images'),
                path.resolve(__dirname, 'web/assets/fonts')
            ],
        }]
    },
    plugins: [
        new webpack.EnvironmentPlugin(['NODE_ENV']),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
        new webpack.DefinePlugin({
            BINARY_PATH: JSON.stringify(staticPrefix + '/binary'),
            IMAGES_PATH: JSON.stringify(staticPrefix + '/images'),
            MUSIC_PATH: JSON.stringify(staticPrefix + '/music'),
            VIDEOS_PATH: JSON.stringify(staticPrefix + '/videos'),
        }),
        new CommonsChunkPlugin({
            name: 'sycpiano.common',
            filename: 'sycpiano.common.js'
        }),
        new CleanWebpackPlugin([path.resolve(__dirname, 'web/build')]),
        new HappyPack({
            id: 'ts',
            threadPool: happyThreadPool,
            loaders: [
                {
                    loader: 'babel-loader',
                },
                {
                    loader: 'ts-loader',
                    options: {
                        happyPackMode: true,
                        transpileOnly: true
                    }
                },
            ]
        }),
        new HappyPack({
            id: 'style',
            threadPool: happyThreadPool,
            loaders: ['style-loader', 'css-loader', 'less-loader'],
        }),
        new HappyPack({
            id: 'url',
            threadPool: happyThreadPool,
            loaders: ['url-loader?limit=100000&name=[name]-[hash].[ext]'],
        }),
    ],
    resolve: {
        extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
        alias: {
            'src': path.resolve(__dirname, 'web/src'),
            'less': path.resolve(__dirname, 'web/less'),
        }
    }
};

module.exports = config;
