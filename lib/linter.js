const stylelint = require('stylelint');

module.exports = class Linter {
  constructor(code) {
    this.code = code;

    this.options = {
      code: this.code,
      config: {
        rules: {
          'selector-max-compound-selectors': 3,
          'selector-max-specificity': '0,4,1',
          'selector-no-id': true,
          'selector-no-combinator': true,
          'selector-no-qualifying-type': true,
          'selector-no-type': true,
        },
      },
    };
    this.warnings = [];
  }

  lint() {
    return new Promise((resolve) => {
      stylelint.lint(this.options)
      .then((data) => {
        this.warnings = data.results[0]._postcssResult.messages;
        resolve(this.warnings);
      });
    });
  }
};
