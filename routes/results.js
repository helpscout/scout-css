const express = require('express');
const normalizeUrl = require('normalize-url');
const getCSS = require('../lib/getCSS');
const parse = require('../lib/parse');

const router = express.Router();
const model = {};

const render = (data) => {
  return parse(data.css).then((results) => {
    model.results = results.slice(0, 250);
    res.render('results', model);
  });
};

router.get('/', function(req, res) {
  model.link = req.query.link || null;
  model.url = req.query.url || null;
  model.title = req.query.title || null;

  if (model.link) {
    getCSS.link(model.link).then((data) => {
      const css = data.css ? data.css : data;
      model.source = model.link;
      model.pageTitle = data.pageTitle ? data.pageTitle : false;
      parse(css).then((results) => {
        model.results = results.slice(0, 250);
        res.render('results', model);
      });
    });
  } else if (model.url) {
    getCSS.url(model.url).then((data) => {
      const css = data.css ? data.css : data;
      model.source = model.url;
      model.pageTitle = data.pageTitle ? data.pageTitle : false;
      parse(css).then((results) => {
        model.results = results.slice(0, 250);
        res.render('results', model);
      });
    });
  }
});

module.exports = router;
