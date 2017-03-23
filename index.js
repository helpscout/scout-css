// Seed Scout
'use strict';

var barista = require('seed-barista');
var stylelint = require('stylelint');

var output = barista({
  src: 'test/css',
  file: 'styles.css',
});

var config = {
  rules: {
    'color-no-hex': true,
  }
};

var options = {
  // code: output.css,
  code: 'body { background: #321321; }',
  config: config,
};

stylelint.lint(options)
  .then(function(data) {
    console.log(data.results[0]._postcssResult);
  });
