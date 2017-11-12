const path = require('path');
const HappyPack = require('happypack');
const Webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
    devtool: 'inline-source-map',
    entry: {
        sycpiano: path.resolve(__dirname, 'web/js/main.jsx'),
        calendarAdmin: path.resolve(__dirname, 'web/js/admin/main.jsx'),
    },
    output: {
        path: path.resolve(__dirname, 'web/build'),
        filename: '[name].bundle.js',
    },
    module: {
        loaders: [
            {
                loader: 'happypack/loader?id=babel',
                test: /\.jsx?$/,
                include: [
                    path.resolve(__dirname, 'web/js'),
                    path.resolve(__dirname, 'web/js/components'),
                    path.resolve(__dirname, 'web/js/admin'),
                    path.resolve(__dirname, 'web/js/admin/components'),
                ],
            },
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
            },
            {
                loader: 'happypack/loader?id=url',
                test: /\.(ttf|eot|woff|woff2|svg|png|jpg)$/,
                include: [
                    path.resolve(__dirname, 'web/assets/images'),
                    path.resolve(__dirname, 'web/assets/fonts')
                ],
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin([path.resolve(__dirname, 'web/build')]),
        new Webpack.HotModuleReplacementPlugin(),
        new HappyPack({
            id: 'babel',
            threads: 4,
            loaders: [
                {
                    loader: 'babel-loader',
                    query: {
                        plugins: ['transform-runtime'],
                        presets: ['env', 'stage-0', 'react']
                    },
                },
            ],
        }),
        new HappyPack({
            id: 'style',
            threads: 1,
            loaders: ['style-loader', 'css-loader', 'less-loader'],
        }),
        new HappyPack({
            id: 'url',
            threads: 1,
            loaders: ['url-loader?limit=100000&name=[name]-[hash].[ext]'],
        }),
    ],
};

module.exports = config;
