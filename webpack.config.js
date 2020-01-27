var path = require('path');
var HtmlWebpackPlugin =  require('html-webpack-plugin');

module.exports = {
    entry: './app/index.jsx',
    output: {
        path: path.resolve(__dirname , 'dist'),
        filename: 'bundle.js'
    },
    module: {
      rules: [
        {test: /\.(jsx)$/, use: 'babel-loader'},
        {test: /\.css$/, use: ['style-loader', 'css-loader']}
      ]
    },
    mode: 'development',
    plugins: [
        new HtmlWebpackPlugin ({
            template: 'app/index.html'
        })
    ]
}
