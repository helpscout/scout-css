const getSeverity = require('./lib/getSeverity');
const threshold = 200000;

const message = (results) => {
  let threshold = 3000;
  console.log(`Tested: ${results.file}`);
  if (results.score > threshold) {
    console.log('🔥 Regression');
    console.log('  🔥 CSS has gotten worse!!! OMG!!! 🔥');
  } else {
    console.log('⚡️ No Regression');
    console.log('  CSS has not gotten worse');
  }
  console.log('Severity:');
  console.log('  Threshold:', threshold);
  console.log('  Score:', results.score);
  console.log('');
};

getSeverity('public/css/seed-framework.min.css').then(results => {
  message(results);
});

getSeverity('public/styles/hs-app.css').then(results => {
  message(results);
});
