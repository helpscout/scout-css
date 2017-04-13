const parse = require('./parse');
const barista = require('seed-barista');

const totalSeverityScore = (results) => {
  return results.reduce((sum, r) => sum += r.severityScore, 0);
};

const severity = (options) => {
  if (!options || typeof options !== 'object') {
    return false;
  }

  const output = barista(options);

  return new Promise((resolve, reject) => {
    if (!output) {
      reject('scout-css: seed-barista could not resolve options.');
    }
    parse(output.css).then((results) => {
      resolve({
        score: totalSeverityScore(results),
        options,
        results,
      });
    });
  });
};

module.exports = severity;
