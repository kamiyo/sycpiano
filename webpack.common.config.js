/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const os = require('os');
require('dotenv').config();

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

const tsxUse = [
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
                        corejs: '3',
                    }
                ],
                '@babel/preset-typescript',
            ],
            plugins: [
                '@babel/syntax-dynamic-import',
                '@babel/proposal-class-properties',
                '@babel/proposal-object-rest-spread',
                ['@babel/transform-runtime', { 'corejs': 3 }]
            ],
        },
    },
];

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
            rules: [
                {
                    test: /\.(t|j)sx?$/,
                    include: sourcePaths,
                    use: tsxUse,
                },
                {
                    test: /node_modules\/vfile\/core\.js/,
                    use: [{
                        loader: 'imports-loader',
                        options: {
                            type: 'commonjs',
                            imports: ['single process/browser process'],
                        },
                    }],
                },
            ],
        },
        optimization: {
            runtimeChunk: true,
        },
        plugins: [
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /^en$/),
            new webpack.DefinePlugin({
                BINARY_PATH: JSON.stringify(staticPrefix + '/binary'),
                IMAGES_PATH: JSON.stringify(staticPrefix + '/images'),
                // MUSIC_PATH: JSON.stringify(staticPrefix + '/music'), => see dev and prod files
                VIDEOS_PATH: JSON.stringify(staticPrefix + '/videos'),
                // GAPI_KEY => see dev and prod files
                STRIPE_PUBLIC: JSON.stringify(process.env.STRIPE_PUBLIC),
            }),
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'web/partials/index.html'),
                scriptLoading: 'defer',
                hash: true,
            }),
        ],
        resolve: {
            extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
            alias: {
                'src': path.resolve(__dirname, 'web/src'),
                path: require.resolve('path-browserify'),
            },
            symlinks: false,
        }
    }
};

module.exports = {
    config: config(),
    staticPrefix,
    sourcePaths,
    tsxUse,
};
