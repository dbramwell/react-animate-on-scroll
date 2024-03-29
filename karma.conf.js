var webpack = require('webpack');

module.exports = function (config) {
  var configuration = {
    browsers: ['ChromeNoSandboxHeadless'],

    customLaunchers: {
      ChromeNoSandboxHeadless: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          // See https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
          '--headless',
          '--disable-gpu',
          // Without a remote debugging port, Google Chrome exits immediately.
          ' --remote-debugging-port=9222',
        ],
      },
    },
    singleRun: true, //just run once by default
    frameworks: [ 'mocha' ], //use the mocha test framework
    files: [
      'tests.webpack.js',
      {pattern: '*.jpg', watched: false, included: false, served: true},
    ],
    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ] //preprocess with webpack and our sourcemap loader
    },
    reporters: ['progress', 'junit'],

    // the default configuration
    junitReporter: {
      outputDir: 'results'
    },
    webpack: { //kind of a copy of your webpack config
      devtool: 'inline-source-map', //just do inline source maps instead of the default
      module: {
        loaders: [{
          test: /\.css$/,
          loader: 'style-loader!css-loader'
        }, {
          test: /\.js$/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015', 'react']
          }
        }]
      },
    },
    webpackServer: {
      noInfo: true //please don't spam the console when running in karma!
    }
  };

  config.set(configuration);
};