const CopyPlugin = require("copy-webpack-plugin");
const ZipPlugin = require('zip-webpack-plugin');
const webpack = require("webpack");

module.exports = {
    entry: {
        popup: "./src/popup/App.tsx",
        content: "./src/content/main.ts",
    },
    output: {
        path: __dirname + "/dist",
        filename: "[name].bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {from: "./src/static"},
                {from: "node_modules/bootstrap/dist/css/bootstrap.min.css"},
            ]
        }),
        new webpack.DefinePlugin({
            UI_MODE: JSON.stringify(process.env.UI_MODE)
        }),
        new ZipPlugin({
            filename: 'schnelltester.zip'
        }),
    ]
};
