// Seed Scout
'use strict';

const parse = require('./lib/parse');
const barista = require('seed-barista');
const express = require('express');
const expressHandleBars = require('express-handlebars');

const stylelint = require('stylelint');
const app = express();

// const routes = require('./routes/index');
// const stats = require('./routes/stats');

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

app.get('/', (req, res) => {
  parse(output.css).then(results => {
    res.render('index', { results: results.slice(0, 250) });
  });
});

app.listen(3000, () => {
  console.log('http://localhost:3000/')
});

module.exports = app;
