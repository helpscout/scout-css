const uniq = require('lodash.uniq');

module.exports = class Auditor {
  constructor() {
    this.data = {};
    this.results = [];
    this.severity = 0;
  }

  audit(data) {
    if (!data) {
      return false;
    }
    this.data = data;
    this.generateResults();
    return this;
  }

  generateResults(cssData) {
    const data = cssData || this.data;
    const results = this.scoreSelectors(this.groupSelectors(
      this.prepareResults(this.parseData(data))));
    const severity = this.tallySeverity(results);
    this.results = results;
    this.severity = severity;
    return this;
  }

  severityScore() {
    if (!this.severity) {
      this.generateResults();
    }
    return this.severity;
  }

  tallySeverity(results) {
    return results.reduce((sum, r) => sum + r.severityScore, 0);
  }

  parseData(data) {
    return data.reduce((a, warning) => {
      const list = a;
      let selector = this.getSelector(warning);
      if (!selector) {
        return list;
      }
      selector = [selector];
      selector.forEach((sel) => {
        const s = sel
          .replace(/>/g, ' > ')
          .replace(/\+/g, ' + ')
          .replace(/~/g, ' ~ ');
        if (!Object.prototype.hasOwnProperty.call(list, s)) {
          list[s] = [warning];
        } else {
          list[s].push(warning);
        }
      });
      return list;
    }, {});
  }

  prepareResults(data) {
    return Object.keys(data).reduce((list, r) => {
      const selectors = r.split(',');
      const entry = {
        selector: r,
        selectors,
        warnings: data[r].length,
      };
      list.push(entry);
      return list;
    }, []);
  }

  getSelector(warning) {
    const type = warning.node.type;
    if (type === 'rule') {
      return warning.node.selector;
    } else if (type === 'decl') {
      return warning.node.parent.selector;
    }
    return false;
  }

  groupSelectors(data) {
    const groups = data.reduce((m, d) => {
      const list = m;
      d.selectors.forEach((s) => {
        const sels = s.trim().split(' ');
        const prime = sels[0].split('[')[0];
        if (prime) {
          if (!Object.prototype.hasOwnProperty.call(list, prime)) {
            let severity = 0;
            if (sels.some(o => o.includes('#'))) {
              severity += (d.warnings * 10); // +1000%
            }
            if (sels.some(o => o === '>')) {
              severity += (d.warnings * 1.25); // +25%
            }
            list[prime] = {
              selector: prime,
              selectors: [s.trim()],
              severity: Math.ceil(severity),
            };
          } else if (!list[prime].selectors.includes(s)) {
            list[prime].selectors.push(s);
            // Severity algorithm?!?! Sure!
            const severity = this.calculateSeverity(
              list[prime].severity,
              list[prime].selectors.length,
              sels);
            list[prime].severity = severity;
          }
        }
      });
      return list;
    }, {});
    return this.sortBySeverity(this.objectToArray(groups));
  }

  calculateSeverity(severity, totalSelectors, selectors) {
    let multiplier = 1;
    if (selectors.some(o => o.includes('#'))) {
      multiplier = 2;
    }
    if (selectors.some(o => o.includes('>'))) {
      multiplier = 1.25;
    }
    let s = (totalSelectors + (selectors.length * 2)) * multiplier;
    s += severity;
    return Math.ceil(s);
  }

  objectToArray(o) {
    return Object.keys(o).map(k => o[k]);
  }

  sortBySeverity(data) {
    return data.sort((a, b) => b.severity - a.severity).filter(s => s.severity > 0);
  }

  scoreSelectors(data) {
    return data.map((d) => {
      const selector = d;
      if (selector.severity > 3999) {
        selector.level6 = true;
      } else if (selector.severity > 999) {
        selector.level5 = true;
      } else if (selector.severity > 349) {
        selector.level4 = true;
      } else if (selector.severity > 299) {
        selector.level3 = true;
      } else if (selector.severity > 199) {
        selector.level2 = true;
      } else if (selector.severity > 49) {
        selector.level1 = true;
      } else if (selector.severity > 11) {
        selector.level0 = true;
      } else {
        selector.ok = true;
      }
      const severity = selector.severity;
      selector.selectors = selector.selectors.sort();
      selector.severity = severity.toLocaleString();
      selector.severityScore = severity;
      selector.keywords = uniq(selector.selectors.join('').split(/,| |\.|>|#|:/)).join(' ');
      return selector;
    });
  }
};
