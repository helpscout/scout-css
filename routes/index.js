const express = require('express');
const router = express.Router();

const model = {};

router.get('/', function(req, res) {
  res.render('index', model);
});

module.exports = router;
