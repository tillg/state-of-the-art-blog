/* jshint esversion: 6 */

const psi = require('psi');
const moment = require('moment');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const url = 'https://tillg.github.io/state-of-the-art-blog/';
//const url = 'http://localhost:3000/';

const testDirectory = './test_results';
const fileNameCore = testDirectory + '/' + moment().format('YYYY-MM-DD-HH_mm_ss') + '_report';
const utilFile = require('./util_file');

//console.log(fileNameCore);

/**
 * Returns a promise on a report in JSON format.
 * @param {*} strategy 
 */
const getPsiReport = (strategy) => {
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

/**
 * Measures with lighthouse and returns the HTML report as Promise.
 * @param {*} url 
 * @param {*} opts 
 * @param {*} config 
 */
function getLighthouseReport(url, opts, config = null) {
  return chromeLauncher.launch({
      chromeFlags: opts.chromeFlags
    })
    .then(chrome => {
      opts.port = chrome.port;
      return lighthouse(url, opts, config).then(results => {
        // use results.lhr for the JS-consumeable output
        // https://github.com/GoogleChrome/lighthouse/blob/master/typings/lhr.d.ts
        // use results.report for the HTML/JSON/CSV output as a string
        // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
        return chrome.kill()
          .then(() => results.lhr);
      });
    });
}

/**
 * Transforms a report in HTML - Returns a promise
 * @param {*} report 
 */
const makeLighthouseHtml = (report) => {
  const reportGenerator = require('./node_modules/lighthouse/lighthouse-core/report/report-generator');
  return reportGenerator.generateReportHtml(report)
};

const opts = {
  chromeFlags: ['--show-paint-rects']
};

['mobile', 'desktop'].forEach(strategy => {
  const fileName = fileNameCore + '_PSI_' + strategy + '.json';
  return reportPromise = getPsiReport(strategy)
    .then(report => {
      return utilFile.writeObjectToFile(report, fileName);
    })
    .then(_ => {
      console.log('Finished measuring PSI with strategy ' + strategy);
    })
    .catch(err => {
      console.log('Error while measure PSI with strategy ' + strategy + ': ' + err.message);
      throw err;
    })
});

getLighthouseReport(url, opts)
  .then(resultsAsObject => {
    const fileName = fileNameCore + '_lighthouse.json';
    return utilFile.writeObjectToFile(resultsAsObject, fileName)
      .then(_ => {
        return resultsAsObject;
      });
  })
  .then(resultsAsObject => {
    return makeLighthouseHtml(resultsAsObject);
  })
  .then(resultsAsHtml => {
    const fileName = fileNameCore + '_lighthouse.html';
    return utilFile.writeResourceToFile(fileName, resultsAsHtml);
  })
  .then(_ => {
    console.log('Finished measuring with lighthouse ');
  })
  .catch(err => {
    console.log('Error when creating lighthouse report: ' + err.message);
    throw err;
  });