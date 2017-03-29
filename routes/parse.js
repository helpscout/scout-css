const express = require('express');
const formidable = require('formidable');
const normalizeUrl = require('normalize-url');
const isPresent = require('is-present');
const isUrl = require('is-url');
const isCss = require('is-css');

const router = express.Router();

router.get('/', function(req, res) {
  res.redirect('/');
});

router.post('/', function(req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, function(error, fields, files) {

    let url = isPresent(fields.url) ? normalizeUrl(fields.url, { stripWWW: false }) : '';
    if (isUrl(url)) {
      url = encodeURIComponent(url);
      if (isCss(url)) {
        res.redirect(`/results?link=${url}`);
      } else {
        res.redirect(`/results?url=${url}`);
      }
    } else {
      res.render('index', { error: 'Please provide a valid url' });
    }
  });
});

module.exports = router;
