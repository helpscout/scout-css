const Auditor = require('./auditor');
const Linter = require('./linter');

const parse = (css) => {
  if (!css || typeof css !== 'string') {
    return false;
  }
  const auditor = new Auditor();
  const linter = new Linter(css);

  return new Promise((resolve) => {
    linter.lint().then((data) => {
      const results = auditor.audit(data).results;
      resolve(results);
    });
  });
};

module.exports = parse;
