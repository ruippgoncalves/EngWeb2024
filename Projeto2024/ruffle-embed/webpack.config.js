const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        library: 'RuffleEmbed',
        filename: 'ruffle-embed.js',
        path: path.resolve(__dirname, '../client/public/javascripts'),
        globalObject: 'this',
    },
    mode: 'production',
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'node_modules/@ruffle-rs/ruffle/*.wasm',
                    to: path.join(__dirname, '../client/public/javascripts', '[name][ext]'),
                },
                {
                    from: 'node_modules/@ruffle-rs/ruffle/core.*.js',
                    to: path.join(__dirname, '../client/public/javascripts', '[name][ext]'),
                }
            ],
        })
    ],
};
