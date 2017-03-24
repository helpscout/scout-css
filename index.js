// Seed Scout
'use strict';

const barista = require('seed-barista');
const express = require('express');
const expressHandleBars = require('express-handlebars');
const stylelint = require('stylelint');
const app = express();

app.engine('handlebars', expressHandleBars({
  defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');

const output = barista({
  src: 'test/css',
  file: 'styles.css',
});

const config = {
  rules: {
    'selector-max-specificity': '0,4,1',
    // 'selector-no-id': true,
  }
};

const options = {
  code: output.css,
  // code: 'body, html { background: #321321; } #h .class div { background: #221; }',
  config: config,
};

const Audit = function(data) {
  this.data = data;
  this.results = {};
  this.initialize();
};

Audit.prototype.initialize = function() {
  var self = this;
  this.data.forEach(this.addToResults.bind(self));
};

Audit.prototype.getSelector = function(warning) {
  const type = warning.node.type;
  if (type === 'rule') {
    return warning.node.selector;
  } else if (type === 'decl') {
    return warning.node.parent.selector;
  } else {
    return false;
  }
};

Audit.prototype.addToResults = function(warning) {
  var selector = this.getSelector(warning);
  if (!selector) {
    return false;
  }
  // selector = selector.split(',').map(function(s) { return s.trim(); });
  // selector = selector.split(', ');
  selector = [selector];
  selector.forEach(sel => {
    if (!this.results.hasOwnProperty(sel)) {
      this.results[sel] = [warning];
    } else {
      this.results[sel].push(warning);
    }
  });
  return this;
};



const lint = function(callback) {
  return stylelint.lint(options)
    .then(data => {
      const warnings = data.results[0]._postcssResult.messages;
      // console.log(data);
      // console.log(data.output);
      const a = new Audit(warnings);
      return callback(a);
    });
};

app.get('/', (req, res) => {
  return lint(data => {
    return res.render('index', data);
  });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
});

module.exports = app;
