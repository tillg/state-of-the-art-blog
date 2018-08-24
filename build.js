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
const debugObject = require('debug');

const pluginPageTitles = require('./pluginPageTitles');

const debug = debugObject('build');
debugObject.enable('build');
const config = require('./config');

const patch = shell.exec('./getversion.sh').stdout.trim();

const build = (callback, siteUrl) => {
  if (!siteUrl) throw new Error('Build function needs to be passed a site URL.');

  metalsmith(__dirname)
    .metadata({
      moment,
      site: {
        title: config.siteTitle,
        subtitle: config.siteSubTitle,
        url: siteUrl,
        author: config.author,
        headerPicture: config.headerPicture,
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
        date: article => article.stats.ctime,
        excerpt: (article) => {
          const articleBeginning = article.contents.toString('utf8').substring(0, config.excerptLength);
          return `${articleBeginning} ...'`;
        },
      },
    },
    ]))
    .use(pluginPageTitles(siteUrl))
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
      hostname: siteUrl,
    }))
    .build((err) => {
      const message = err || 'Build completed successfully';
      debug(new Date(), message);
    });
  if (callback) {
    callback();
  }
};

// If I run node run deploy --prod, it should not use browser-sync to watch for changes.
// Otherwise, it should.
debug(argv);

if (argv._.includes('deploy')) {
  build(() => {
    debug(`Done building with Patch ${patch}`);
  }, config.productionUrl);
} else {
  build(() => {
    debug(`Done building with Patch ${patch}`);
  }, config.devUrl);
}
