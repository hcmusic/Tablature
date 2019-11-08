const path = require('path');

module.exports = {
    entry: {
        test: './src/test.ts'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
        library: '[name]',
        filename: '[name].js',
        path: path.resolve(__dirname, 'test')
    }
};