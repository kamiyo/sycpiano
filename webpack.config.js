var path = require('path');
var Webpack = require('webpack');

var config = {
    devtool: 'eval',
    entry: [
        'webpack-dev-server/client?http://localhost:8080/',
        'webpack/hot/dev-server',
        path.resolve(__dirname, 'web/js/main.jsx'),
    ],
    output: {
        path: path.resolve(__dirname, 'web/build'),
        filename: 'bundle.js',
        publicPath: '/build/',
    },
    module: {
        loaders: [{
            loader: 'babel-loader',
            test: /\.jsx?$/,
            include: [
                path.resolve(__dirname, 'web/js'),
                path.resolve(__dirname, 'web/js/*')
            ],
            query: {
                presets: ['es2015', 'react'],
            }
        },
        {
            loaders: ['style-loader', 'css-loader', 'less-loader'],
            test: /\.less$/,
            include: [
                path.resolve(__dirname, 'web/less')
            ],
        },
        {
            loaders: ['url-loader?limit=100000&name=[name]-[hash].[ext]'],
            test: /\.(ttf|eot|woff|woff2|svg|png|jpg)$/,
            include: [
                path.resolve(__dirname, 'web/assets/images'),
                path.resolve(__dirname, 'web/assets/fonts')
            ]
        }]
    },
    plugins: [new Webpack.HotModuleReplacementPlugin()]
};

module.exports = config;