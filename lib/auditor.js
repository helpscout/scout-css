const uniq = require('lodash.uniq');

module.exports = class Auditor {
  constructor() {
    this.results = [];
  }

  audit(data) {
    if (!data) {
      return false;
    }
    this.generateResults(data);
    return this;
  }

  generateResults(data) {
    const results = this.groupSelectors(this.prepareResults(this.parseData(data)));
    this.results = this.scoreSelectors(results);
    return this;
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
        let s = sel
          .replace(/\>/g, ' > ')
          .replace(/\+/g, ' + ')
          .replace(/\~/g, ' ~ ');
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
    const results = Object.keys(data).reduce((list, r) => {
      const selectors = r.split(',');
      const entry = {
        selector: r,
        selectors,
        warnings: data[r].length,
      };
      list.push(entry);
      return list;
    }, []);
    return this.sortByWarnings(results);
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
            let severity = d.warnings;
            if (sels.some(s => s.includes('#'))) {
              severity *= 10; // +1000%
            }
            if (sels.some(s => s === '>')) {
              severity *= 1.25; // +25%
            }
            list[prime] = {
              selector: prime,
              selectors: [s.trim()],
              severity,
            };
          } else {
            let severity = list[prime].severity;
            let multiplier = 1;
            if (sels.some(s => s.includes('#'))) {
              multiplier = 2;
            }
            if (sels.some(s => s.includes('>'))) {
              multiplier = 1.25;
            }
            list[prime].selectors.push(s);
            // Severity algorithm?!?! Sure!
            list[prime].severity = Math.round(severity + ((list[prime].selectors.length + (sels.length * 2)) * multiplier));
          }
        }
      });
      return list;
    }, {});
    return this.sortBySeverity(this.objectToArray(groups));
  }

  objectToArray(o) {
    return Object.keys(o).map(k => o[k]);
  }

  sortBySeverity(data) {
    return data.sort((a, b) => b.severity - a.severity);
  }

  sortByWarnings(data) {
    return data.sort((a, b) => {
      return (b.warnings + b.selectors.length) - (a.warnings + a.selectors.length);
    });
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
      let severity = selector.severity;
      selector.selectors = uniq(selector.selectors).sort();
      selector.severity = severity.toLocaleString();
      selector.keywords = uniq(selector.selectors.join('').split(/,| |\.|>|#|:/)).join(' ');
      return selector;
    });
  }
};
