const parse = require('./parse');
const barista = require('seed-barista');

const totalSeverityScore = (results) => {
  return results.reduce((sum, r) => sum += r.severityScore, 0);
};

const severity = (file) => {
  if (!file || typeof file !== 'string') {
    return false;
  }

  const output = barista({
    src: '/',
    file,
  });

  return new Promise((resolve) => {
    parse(output.css).then((results) => {
      resolve({
        score: totalSeverityScore(results),
        file,
        results,
      });
    });
  });
};

module.exports = severity;
