const fs = require('fs');
const csso = require('csso');
const buble = require('rollup-plugin-buble');
const istanbul = require('rollup-plugin-istanbul');
const replace = require('rollup-plugin-replace');
const resolve = require('rollup-plugin-node-resolve');

module.exports = (config) => {
  config.set({
    singleRun: true,
    frameworks: ['mocha', 'chai'],
    browsers: ['ChromeHeadless'],
    files: [
      { pattern: 'test/fixtures/**/*.*', included: false, served: true },
      'test/test.js',
    ],
    preprocessors: {
      'test/test.js': ['rollup'],
    },
    rollupPreprocessor: {
      format: 'iife',
      plugins: [
        replace({
          __GLOBAL_CSS__: csso.minify(fs.readFileSync('./src/global.css')).css,
        }),
        resolve(),
        istanbul({
          include: ['src/**/*'],
        }),
        buble(),
      ],
    },
    reporters: ['dots', 'coverage'],
    coverageReporter: {
      type: 'lcov',
      subdir: '.',
    },
  });
};
