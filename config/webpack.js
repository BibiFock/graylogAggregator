var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry:[
        path.resolve(__dirname, '../src/client/scripts/client.js'),
    ],
    devServer:{
        entry: [
            'webpack-dev-server/client?http://localhost:8080/', // WebpackDevServer host and port
            'webpack/hot/dev-server', // 'only' prevents reload on syntax errors
        ],
        contentBase: './src/client/',
        proxy: {
            '/api/*': {
                target: 'http://localhost:1664',
                secure: false,
            },
        },
        hot: true
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.scss'],
        modulesDirectories: ['./bower_components', 'node_modules']
    },
    module: {
        loaders: [
            {
                test: /src\/.+.js|jsx$/,
                loader: 'babel'
            },
            {test: /\.jsx$/, loaders: ['react-hot', 'babel'], include: path.join(__dirname, 'src')},
            {
                test: /\.scss$/,
                exclude: [/node_modules/],
                loader: 'style!css!sass'
            },
            { test: /\.md$/, loader: 'html!markdown' },
        ],

    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};
