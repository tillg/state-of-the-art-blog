/* jshint esversion: 6 */

const psi = require('psi');
const moment = require('moment');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const debug = require('debug')('measure');
const chalk = require('chalk');
const reportGenerator = require('./node_modules/lighthouse/lighthouse-core/report/report-generator');

const url = 'https://tillg.github.io/state-of-the-art-blog/';
// const url = 'http://localhost:3000/';

const testDirectory = './test_results';
const fileNameCore = `${testDirectory}/${moment().format('YYYY-MM-DD-HH_mm_ss')}_report`;
const utilFile = require('./util_file');

// console.log(fileNameCore);

/**
 * Returns a promise on a report in JSON format.
 * @param {*} strategy
 */
const getPsiReport = (strategy) => {
  const returnPromise = new Promise((resolve, reject) => {
    psi(url, {
      strategy,
    })
      .then((report) => {
        resolve(report);
      })
      .catch((err) => {
        const report = err;
        debug(`Error: ${err.message}`);
        reject(err);
      });
  });
  return returnPromise;
};

/**
 * Measures with lighthouse and returns the HTML report as Promise.
 * @param {*} url
 * @param {*} opts
 * @param {*} config
 */
function getLighthouseReport(url, opts, config = null) {
  return chromeLauncher.launch({
    chromeFlags: opts.chromeFlags,
  })
    .then((chrome) => {
      opts.port = chrome.port;
      return lighthouse(url, opts, config).then(results => chrome.kill()
        .then(() => results.lhr));
    });
}

/**
 * Transforms a report in HTML - Returns a promise
 * @param {*} report
 */
const makeLighthouseHtml = report => reportGenerator.generateReportHtml(report);

const opts = {
  chromeFlags: ['--show-paint-rects'],
};

['mobile', 'desktop'].forEach((strategy) => {
  const fileName = `${fileNameCore}_PSI_${strategy}.json`;
  const reportPromise = getPsiReport(strategy)
    .then(report => utilFile.writeObjectToFile(report, fileName))
    .then(() => {
      debug(`Finished measuring PSI with strategy ${strategy}`);
    })
    .catch((err) => {
      debug(`Error while measure PSI with strategy ${strategy}: ${err.message}`);
      throw err;
    });
  return reportPromise;
});

getLighthouseReport(url, opts)
  .then((resultsAsObject) => {
    const fileName = `${fileNameCore}_lighthouse.json`;
    return utilFile.writeObjectToFile(resultsAsObject, fileName)
      .then(() => resultsAsObject);
  })
  .then(resultsAsObject => makeLighthouseHtml(resultsAsObject))
  .then((resultsAsHtml) => {
    const fileName = `${fileNameCore}_lighthouse.html`;
    return utilFile.writeResourceToFile(fileName, resultsAsHtml);
  })
  .then(() => {
    debug('Finished measuring with lighthouse ');
  })
  .catch((err) => {
    debug(`Error when creating lighthouse report: ${err.message}`);
    throw err;
  });
