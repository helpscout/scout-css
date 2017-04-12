const request = require('request');
const getCss = require('get-css');

const link = (ln) => {
  return new Promise((resolve, reject) => {
    request({ url: ln, timeout: 5000 }, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
};

const url = (ln) => {
  return new Promise((resolve, reject) => {
    getCss(ln)
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
};

module.exports = {
  link,
  url,
};
