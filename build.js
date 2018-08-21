const metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');
const templates = require('metalsmith-templates');
const permalinks = require('metalsmith-permalinks');
const collections = require('metalsmith-collections');
const assets = require('metalsmith-assets');
const argv = require('minimist')(process.argv);
const drafts = require('metalsmith-drafts');
const moment = require('moment');
const logger = require('metalsmith-logger'); // eslint-disable-line no-unused-vars
const defaultValues = require('metalsmith-default-values');
const assert = require('metalsmith-assert'); // eslint-disable-line no-unused-vars
const sitemap = require('metalsmith-sitemap');
const buildDate = require('metalsmith-build-date');
const shell = require('shelljs');
const debug = require('debug')('build');

const config = require('./config');

const patch = shell.exec('./getversion.sh').stdout.trim();

function build(callback, siteUrl) {
  metalsmith(__dirname)
    .metadata({
      moment,
      site: {
        title: config.siteTitle,
        subtitle: config.siteSubTitle,
        url: siteUrl || config.productionUrl,
        author: config.author,
        twitterLink: config.twitterLink,
        facebookLink: config.facebookLink,
        githubLink: config.githubLink,
        googleTrackingCode: config.googleTrackingCode,
        buildPatch: patch,
      },
    })
    .source('src')
    .destination('build')
    .clean(true) // Clean the target dir before building
    .use(buildDate({
      key: 'buildDate',
    }))
    .use(defaultValues([{
      pattern: '**/*.md',
      defaults: {
        template: 'article.jade',
        date(post) {
          return post.stats.ctime;
        },
      },
    }]))
    .use(drafts())
    .use(collections({
      articles: {
        pattern: 'articles/**/*.md',
        sort: 'date',
        reverse: true,
      },
    }))
    .use(markdown({
      smartypants: true,
      gfm: true,
      tables: true,
    }))
    .use(assets({
      source: './assets/',
      destination: './assets',
    }))
    .use(permalinks())
    .use(templates({
      engine: 'jade',
      directory: 'templates',
      pretty: true,
    }))
    .use(sitemap({
      hostname: siteUrl || config.productionUrl,
    }))
    .build((err) => {
      const message = err || 'Build completed successfully';
      debug(new Date(), message);
    });
  if (callback) {
    callback();
  }
}

// If I run node run deploy --prod, it should not use browser-sync to watch for changes.
// Otherwise, it should.
debug(argv);

if (argv._.includes('deploy')) {
  build(() => {
    debug('Done building.');
  }, config.productionUrl);
} else {
  build(() => {
    debug('Done building.');
  }, config.devUrl);
}
