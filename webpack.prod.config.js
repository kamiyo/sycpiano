/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');
const os = require('os');

const config = merge(common, {
    mode: 'production',
    output: {
        filename: '[name].bundle.js',
    },
});

module.exports = config;
