// Seed Scout
'use strict';

var barista = require('seed-barista');
var express = require('express');
var stylelint = require('stylelint');
var app = express();

var output = barista({
  src: 'test/css',
  file: 'styles.css',
});

var config = {
  rules: {
    'selector-max-specificity': '0,4,1',
    // 'selector-no-id': true,
  }
};

var options = {
  code: output.css,
  // code: 'body, html { background: #321321; } #h .class div { background: #221; }',
  config: config,
};

var Audit = function(data) {
  this.data = data;
  this.results = {};
  this.initialize();
};

Audit.prototype.initialize = function() {
  var self = this;
  this.data.forEach(this.addToResults.bind(self));
};

Audit.prototype.getSelector = function(warning) {
  var type = warning.node.type;
  if (type === 'rule') {
    return warning.node.selector;
  } else if (type === 'decl') {
    return warning.node.parent.selector;
  } else {
    return false;
  }
};

Audit.prototype.addToResults = function(warning) {
  var self = this;
  var selector = this.getSelector(warning);
  if (!selector) {
    return false;
  }
  // selector = selector.split(',').map(function(s) { return s.trim(); });
  // selector = selector.split(', ');
  selector = [selector];
  selector.forEach(function(sel) {
    if (!self.results.hasOwnProperty(sel)) {
      self.results[sel] = [warning];
    } else {
      self.results[sel].push(warning);
    }
  });
  return this;
};



var lint = function(callback) {
  stylelint.lint(options)
    .then(function(data) {
      var warnings = data.results[0]._postcssResult.messages;
      // console.log(data);
      // console.log(data.output);
      var a = new Audit(warnings);
      callback(a);
    });
};

var express = require('express')
var app = express();

var render = function(data) {
  var template = '<ul>';
  Object.keys(data).forEach(function(d) {
    template += `<li>${d}</li>`;
  });
  template += '</ul>';

  return `<html>
    <body>
      ${template}
    </body>
  </html>`;
};

app.get('/', function (req, res) {
  lint(function(data) {
    res.send(render(data.results));
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

module.exports = app;
