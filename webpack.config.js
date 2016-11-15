var path = require('path');
var Webpack = require('webpack');

function getEntryPoint(entryPointPath) {
    return [
        'webpack-dev-server/client?http://localhost:8080/',
        'webpack/hot/dev-server',
        path.resolve(__dirname, entryPointPath),
    ]
}

var config = {
    devtool: 'source-map',
    entry: {
        sycpiano: getEntryPoint('web/js/main.jsx'),
        calendarAdmin: getEntryPoint('web/js/admin/main.jsx'),
    },
    output: {
        path: path.resolve(__dirname, 'web/build'),
        filename: '[name].bundle.js',
        publicPath: '/build/',
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: /\.jsx?$/,
                include: [
                    path.resolve(__dirname, 'web/js'),
                    path.resolve(__dirname, 'web/js/components/*'),
                    path.resolve(__dirname, 'web/js/admin'),
                    path.resolve(__dirname, 'web/js/admin/components/*'),
                ],
                query: {
                    presets: ['react', 'es2016', 'stage-1'],
                }
            },
            {
                loaders: ['style-loader', 'css-loader', 'less-loader'],
                test: /\.(css|less)$/,
                include: [
                    path.resolve(__dirname, 'web/less'),
                    path.resolve(__dirname, 'node_modules/react-datepicker/dist'),
                    path.resolve(__dirname, 'node_modules/react-select/dist')
                ],
            },
            {
                loaders: ['url-loader?limit=100000&name=[name]-[hash].[ext]'],
                test: /\.(ttf|eot|woff|woff2|svg|png|jpg)$/,
                include: [
                    path.resolve(__dirname, 'web/assets/images'),
                    path.resolve(__dirname, 'web/assets/fonts')
                ]
            },
            {
                include: /\.json$/,
                loaders: ['json-loader']
            }
        ]
    },
    plugins: [
        new Webpack.HotModuleReplacementPlugin()
    ]
};

module.exports = config;
