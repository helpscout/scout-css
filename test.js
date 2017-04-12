const getSeverity = require('./lib/getSeverity');

console.log('');
const message = (results, threshold) => {
  console.log(`Tested: ${results.file}`);
  if (results.score > threshold) {
    console.log('🔥 Regression');
    console.log('  🔥 CSS has gotten worse!!! OMG!!! 🔥');
  } else {
    console.log('⚡️ No Regression');
    console.log('  CSS has not gotten worse');
  }
  console.log('Severity:');
  console.log('  Threshold:', threshold.toLocaleString());
  console.log('      Score:', results.score.toLocaleString());
  console.log('');
};

getSeverity('public/css/seed-framework.min.css').then(results => {
  message(results, 3000);
});

getSeverity('public/styles/hs-app.css').then(results => {
  message(results, 200000);
});
