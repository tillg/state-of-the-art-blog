/*jshint esversion: 6 */

/**
 * Someutilities around networking...
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const utilFile = require('./util_file');
const request = require('request');
const logger = require('./util_log').moduleLogger(module);

/**
 * Downloads the HTML of a page. If the callback argument is omitted a Promise is returned.
 * @param {*} url 
 * @param {*} callback 
 */
exports.downloadHtml = (url, callback) => {
  //logger.verbose('util_net.loadHtml: (as Promise) Loading ' + url);
  const promise = new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      //logger.verbose('downloadHtmlWith: Returned from request callback. Error: ' + error);
      if (error) {
        logger.error('downloadHtml: Error: ' + error);
        reject(error);
        return;
      }
      //logger.verbose('downloadHtml: statusCode:' + response.statusCode); // Print the response status code if a response was received
      //logger.verbose('downloadHtmlWithCallback: body:', body); // Print the HTML for the Google homepage.
      resolve(body);
    });
  });

  if (callback && typeof callback == 'function') {
    promise.then(callback.bind(null, null), callback);
  }
  return promise;
};

/**
 * Check wether a passed URL is valid.
 * regex tcourtesy of here:
 * https://stackoverflow.com/questions/8667070/javascript-regular-expression-to-validate-url
 * @param {String} url to be validated.
 */
exports.isValidUrl = (url) => {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
};

/**
 * Downloads an image and writes it to disk. Returns a promise.
 * @param {} url 
 * @param {*} filePath 
 * @param {*} filename 
 */
exports.downloadImageToFile = (url, filePath, filename) => {
  const fullFilename = filePath + filename;

  utilFile.ensureDirectoryExistence(fullFilename);
  const promise = new Promise((resolve, reject) => {
    request
      .get(url)
      .on('error', err => {
        reject(err);
      })
      .pipe(fs.createWriteStream(fullFilename))
      .on('close', function () {
        logger.verbose('Finished downloading image ' + url);
        resolve(fullFilename);
      });
  });
  return promise;
};