#!/usr/bin/env node
'use strict';
const meow = require('meow');
const pkg = require('../package');

const cli = meow(`
  Usage:
    scout-css <command>
  Commands:
    c, check-severity       Checks CSS Severity Score

  ${pkg.name} v${pkg.version}
  License: ${pkg.license}
  Website: ${pkg.homepage}
`, {
  alias: {
    c: 'check-severity'
  }
});

module.exports = cli;
