var path = require('path');
var Webpack = require('webpack');

var config = {
    devtool: 'eval',
    entry: [
        'webpack-dev-server/client?http://localhost:8080/',
        'webpack/hot/dev-server',
        path.resolve(__dirname, 'web/app/main.js'),
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
                path.resolve(__dirname, 'web/app')
            ],
            query: {
                presets: ['es2015', 'react'],
            }
        },
        {
            loaders: ['style-loader', 'css-loader', 'less-loader'],
            test: /\.less$/,
            include: [
                path.resolve(__dirname, 'web/app')
            ],
        }]
    },
    plugins: [new Webpack.HotModuleReplacementPlugin()]
};

module.exports = config;