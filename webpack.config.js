/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

const path = require('path');
const HappyPack = require('happypack');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const happyThreadPool = HappyPack.ThreadPool({ size: 6 });
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const config = {
    cache: true,
    devtool: 'inline-source-map',
    entry: {
        sycpiano: path.resolve(__dirname, 'web/js/main.jsx'),
        calendarAdmin: path.resolve(__dirname, 'web/js/admin/main.jsx'),
        // vendor: vendorDep
    },
    output: {
        path: path.resolve(__dirname, 'web/build'),
        filename: '[name].bundle.js',
        // chunkFilename: '[chunkhash].js'
    },
    module: {
        loaders: [{
            test: /\.ts|\.tsx|\.js|\.jsx$/,
            include: [
                path.resolve(__dirname, 'web/js'),
                path.resolve(__dirname, 'web/js/components'),
                path.resolve(__dirname, 'web/js/admin'),
                path.resolve(__dirname, 'web/js/admin/components'),
            ],
            loader: 'happypack/loader?id=ts'

        },
        // {
        //     test: /\.jsx?$/,
        //     include: [
        //         path.resolve(__dirname, 'web/js'),
        //         path.resolve(__dirname, 'web/js/components'),
        //         path.resolve(__dirname, 'web/js/admin'),
        //         path.resolve(__dirname, 'web/js/admin/components'),
        //     ],
        //     loader: 'happypack/loader?id=js'
        // },
        {
            loader: 'happypack/loader?id=style',
            test: /\.(css|less)$/,
            include: [
                path.resolve(__dirname, 'web/less'),
                // need following for admin page
                path.resolve(__dirname, 'node_modules/react-datepicker/dist'),
                path.resolve(__dirname, 'node_modules/react-dates/lib/css'),
                path.resolve(__dirname, 'node_modules/react-select/dist')
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
        new ForkTsCheckerWebpackPlugin({
            checkSyntacticErrors: true,
            tslint: true,
            watch: [
                path.resolve(__dirname, 'web/js'),
                path.resolve(__dirname, 'web/js/components'),
                path.resolve(__dirname, 'web/js/admin'),
                path.resolve(__dirname, 'web/js/admin/components'),
            ],
        }),
        new CleanWebpackPlugin([path.resolve(__dirname, 'web/build')]),
        new webpack.HotModuleReplacementPlugin(),
        new HappyPack({
            id: 'ts',
            threadPool: happyThreadPool,
            loaders: [
                // {
                //     loader: 'babel-loader',
                //     options: {
                //         presets: ['env', 'react']
                //     }
                // },
                {
                    loader: 'ts-loader',
                    options: {
                        happyPackMode: true
                    }
                }
            ]
        }),
        // new HappyPack({
        //     id: 'js',
        //     threadPool: happyThreadPool,
        //     loaders: [
        //         {
        //             loader: 'babel-loader',
        //             query: {
        //                 plugins: ['transform-runtime'],
        //                 presets: ['env', 'stage-0', 'react']
        //             }
        //         }
        //     ],
        // }),
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
            "js": path.resolve('./web/js'),
            "less": path.resolve('./web/less')
        }
    }
};

module.exports = config;