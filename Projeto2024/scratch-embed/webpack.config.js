const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        library: 'ScratchEmbed',
        filename: 'scratch-embed.js',
        path: path.resolve(__dirname, '../client/public/javascripts'),
    },
    mode: 'production',
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
    resolve: {
        fallback: {
            "buffer": require.resolve("buffer")
        }
    },
};
