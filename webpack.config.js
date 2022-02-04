const path = require('path');

// eslint-disable-next-line no-undef
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    // eslint-disable-next-line no-undef
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map',
  
};