// Seed Scout
'use strict';

const barista = require('seed-barista');
const data = require('./data/styles');
const express = require('express');
const expressHandleBars = require('express-handlebars');
const uniq = require('lodash.uniq');
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
    'selector-no-id': true,
    'selector-no-combinator': true,
    'selector-no-qualifying-type': true,
    'selector-no-type': true,
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
      const selectors = r.split(',');
      const entry = {
        selector: r,
        selectors: selectors,
        warnings: this.results[r].length,
        priority: priority,
      };
      list.push(entry);
      return list;
    }, [])
    .sort((a, b) => {
      return (b.warnings + b.selectors.length) - (a.warnings + a.selectors.length);
    }
  );
};

const groupSelectors = function(data) {
  let map = data.reduce((map, d) => {
    d.selectors.forEach(s => {
      const prime = s.trim().split(' ')[0].split('[')[0];
      const p = prime.replace('.', '_');

      if (!map.hasOwnProperty(p)) {
        let severity = d.warnings;
        if (prime[0] === '#') {
          severity = severity * 10;
        }
        map[p] = {
          selector: prime,
          selectors: [s.trim()],
          severity: severity,
        };
      } else {
        map[p].selectors.push(s);
        map[p].severity = map[p].severity + (map[p].selectors.length);
      };
    });
    return map;
  }, {});
  map = Object.keys(map).map(k => { return map[k]; });
  return map.sort((a, b) => { return (b.severity) - (a.severity) });
};

const scoreSelectors = function(data) {
  return data.map(d => {
    if (d.severity > 349) {
      d.level4 = true;
    } else if (d.severity > 299) {
      d.level3 = true;
    } else if (d.severity > 199) {
      d.level2 = true;
    } else if (d.severity > 49) {
      d.level1 = true;
    } else {
      d.level0 = true;
    }
    d.selectors = uniq(d.selectors).sort();
    return d;
  });
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
  res.render('index', { results: scoreSelectors(groupSelectors(data.results).slice(0, 250)) });
  // return lint(data => {
  //   const r = data.getResults();
  //   const results = data.getResults().slice(0, 1000).filter(r => {
  //     return !r.selector.includes('redactor') && !r.selector.includes('html');
  //   });
  //   // res.render('index', { results: results });
  //   res.send({ results: results });
  // });
});

app.listen(3000, () => {
  console.log('http://localhost:3000/')
});

module.exports = app;
