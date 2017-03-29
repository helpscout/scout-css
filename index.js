// Seed Scout
'use strict';

const express = require('express');
const expressHandleBars = require('express-handlebars');

const index = require('./routes/index');
const parse = require('./routes/parse');
const results = require('./routes/results');

const app = express();

app.engine('hbs', expressHandleBars({
  defaultLayout: 'main',
  extname: '.hbs',
}));
app.set('view engine', 'hbs');
app.use(express.static('public'));

app.use('/', index);
app.use('/parse', parse);
app.use('/results', results);

app.listen(3000, () => {
  console.log('http://localhost:3000/')
});

module.exports = app;
