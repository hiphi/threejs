'use strict';

const path = require('path');
module.exports = {
    // mode: 'production',
    mode: 'development',
    devtool: 'source-map',
    entry: {
        'index.js' :'../src/ts/main.ts'
    },
    output: {
        path: `${__dirname}/dist`,
        filename: '[name]'
        //filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader'
                }
            }
        ]
    },
    resolve: {
        // extensions: ['.ts','.js','.json','.css','jsx'],
        extensions: [ '.ts', '.js' ],
        modules: [path.resolve(__dirname, "src"), "node_modules"],
        alias: {
            //easeljs: path.resolve(__dirname, 'node_modules/createjs-easeljs/lib/easeljs-0.8.2.min.js'),
            //preloadjs: path.resolve(__dirname, 'node_modules/createjs-preloadjs/lib/preloadjs-0.6.2.min.js'),
            //tweenjs: path.resolve(__dirname, 'node_modules/createjs-tweenjs/lib/tweenjs-0.6.0.min.js'),
            //easing: path.resolve(__dirname, 'node_modules/jquery.easing/')
        }
    }
};