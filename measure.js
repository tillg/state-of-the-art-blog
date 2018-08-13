/* jshint esversion: 6 */

const psi = require('psi');
const moment = require('moment');
const url = 'https://tillg.github.io/state-of-the-art-blog/';

const testDirectory = './test_results';
const fileNameCore = testDirectory + '/' + moment().format('YYYY-MM-DD-HH_mm_ss') + '_PSI_report_';
const utilFile = require('./util_file');

//console.log(fileNameCore);

/**
 * Returns a promise on a report in JSON format.
 * @param {*} strategy 
 */
const getReport = (strategy) => {
  let report;
  return new Promise((resolve, reject) => {
    psi(url, {
        strategy: strategy
      })
      .then((report) => {
        resolve(report);
      })
      .catch(err => {
        const report = err;
        console.log('Error: ' + err.message);
        reject(err);
      })
  });
};

['mobile', 'desktop'].forEach(strategy => {
  const fileName = fileNameCore + strategy + '.json';
  return reportPromise = getReport(strategy)
    .then(report => {
      return utilFile.writeObjectToFile(report, fileName)
    })
    .then(_ => {
      console.log('Finished measuring PSI with strategy ' + strategy);
    })
});