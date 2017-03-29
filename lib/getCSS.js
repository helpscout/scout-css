const request = require('request');
const getCss = require('get-css');

const link = (link) => {
  return new Promise((resolve, reject) => {
    request({ url: link, timeout: 5000 }, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
};

const url = (url) => {
  return new Promise((resolve, reject) => {
    getCss(url)
      .then(function(response) {
        resolve(response);
      })
      .catch(function(error) {
        reject(error);
      });
  });
};

module.exports = {
  link: link,
  url: url,
};
