var metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var permalinks = require('metalsmith-permalinks');
var collections = require('metalsmith-collections');
var assets = require('metalsmith-assets');
var argv = require('minimist')(process.argv);
var browserSync = require('browser-sync');
var drafts = require('metalsmith-drafts');
var moment = require('moment');
var logger = require('metalsmith-logger');
var default_values = require('metalsmith-default-values');
var assert = require('metalsmith-assert');
var sitemap = require('metalsmith-sitemap');
var config = require('./config');
var buildDate = require('metalsmith-build-date');
var shell = require('shelljs');

var patch = shell.exec('./getversion.sh').stdout.trim();

// If I run node run deploy --prod, it should not use browser-sync to watch for changes.
// Otherwise, it should.
console.log(argv);
if (!argv._.includes('deploy') && argv._.includes('serve')) {
  browserSync({
    server: 'build',
    files: ['src/*.md', 'templates/*.jade', 'assets/*.css'],
    middleware: function (req, res, next) {
      build(next, config.devUrl);
    }
  });
} else if (!argv._.includes('deploy')) {
  build(function () {
    console.log('Done building.');
  }, config.devUrl);
} else {
  build(function () {
    console.log('Done building.');
  });
}

function build(callback, siteUrl) {
  metalsmith(__dirname)
    .metadata({
      moment,
      site: {
        title: config.siteTitle,
        subtitle: config.siteSubTitle,
        url: siteUrl ? siteUrl : config.productionUrl,
        author: config.author,
        twitterLink: config.twitterLink,
        facebookLink: config.facebookLink,
        githubLink: config.githubLink,
        googleTrackingCode: config.googleTrackingCode,
        buildPatch: patch
      }
    })
    .source('src')
    .destination('build')
    .clean(true) // Clean the target dir before building
    .use(buildDate({
      key: 'buildDate'
    }))
    .use(default_values([{
      pattern: '**/*.md',
      defaults: {
        template: 'article.jade',
        date: function (post) {
          return post.stats.ctime;
        }
      }
    }]))
    .use(drafts())
    .use(collections({
      articles: {
        pattern: 'articles/**/*.md',
        sort: 'date',
        reverse: true
      }
    }))
    /*.use(assert({
      "title exists": {
        actual: "title"
      },
      "date exists": {
        actual: "date"
      }
    }))*/
    .use(markdown({
      smartypants: true,
      gfm: true,
      tables: true,
    }))
    .use(assets({
      source: './assets/',
      destination: './assets'
    }))
    .use(permalinks())
    .use(templates({
      engine: 'jade',
      directory: 'templates',
      pretty: true
    }))
    .use(sitemap({
      'hostname': siteUrl ? siteUrl : config.productionUrl
    }))
    .build(function (err) {
      var message = err ? err : 'Build complete';
      console.log(new Date(), message);
      callback();
    });
}