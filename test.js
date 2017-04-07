const getSeverity = require('./lib/getSeverity');

getSeverity('public/styles/hs-app.css').then(results => {
  const threshold = 200000;
  if (results.score > threshold) {
    console.log('Regression');
    console.log('  🔥 CSS has gotten worse!!!');
  } else {
    console.log('CSS is fine…');
  }
  console.log('Severity:');
  console.log('  Threshold:', threshold);
  console.log('  Score:', results.score);
});
