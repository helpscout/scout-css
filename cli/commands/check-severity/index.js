'use strict';
const fs = require('fs');
const glob = require('glob');
const cli = require('../../index');
const command = cli.input[0];
const getSeverity = require('../../../lib/getSeverity');

if (command !== 'c' && command !== 'check-severity') { return; }

const printMessage = (results) => {
  console.log('');
  console.log(`Tested: ${results.file}`);
  console.log(`Severity Score: ${results.score.toLocaleString()}`);
};

const cssPath = cli.input[1];

if (!cssPath) {
  console.log('You need to specify a path to check for CSS files.');
  process.exit(0);
}

const fsStats = fs.statSync(cssPath);
const globStr = (fsStats.isDirectory()) ? cssPath + '/**/*.css' : cssPath;

glob(globStr, (er, files) => {
  files.map(file => {
    getSeverity(file).then(printMessage)
  })
});
