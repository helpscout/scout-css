// Seed Scout
'use strict';

const barista = require('seed-barista');
const express = require('express');
const expressHandleBars = require('express-handlebars');
const stylelint = require('stylelint');
const app = express();

app.engine('hbs', expressHandleBars({
  defaultLayout: 'main',
  extname: '.hbs',
}));
app.set('view engine', 'hbs');
app.use(express.static('public'));

const output = barista({
  src: 'test/css',
  file: 'styles.css',
});

const config = {
  rules: {
    'selector-max-compound-selectors': 3,
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

Audit.prototype.getResults = function() {
  const results = Object.keys(this.results);
  return results.reduce((list, r) => {
      const severity = r.split(' ');
      let priority = 0;
      if (severity.length > 5) {
        priority = 4;
      } else if(severity.length > 3) {
        priority = 3;
      } else if(severity.length > 2) {
        priority = 2;
      } else if(severity.length > 0) {
        priority = 1;
      }
      const entry = {
        selector: r,
        warnings: this.results[r],
        priority: priority,
        isSuperBad: priority === 4,
        isPrettyBad: priority === 3,
        isBad: priority === 2,
        isMild: priority === 1,
        isLow: priority === 0,
      };
      list.push(entry);
      return list;
    }, [])
    .sort((a, b) => {
      return b.warnings.length - a.warnings.length;
    }
  );
};

const lint = function(callback) {
  return stylelint.lint(options)
    .then(data => {
      const warnings = data.results[0]._postcssResult.messages;
      const a = new Audit(warnings);
      return callback(a);
    });
};

app.get('/', (req, res) => {
  return lint(data => {
    const r = data.getResults();
    return res.render('index', { results: data.getResults().slice(0, 300) });
  });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
});

module.exports = app;
