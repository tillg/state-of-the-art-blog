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

// If I run node run deploy --prod, it should not use browser-sync to watch for changes.
// Otherwise, it should.
if (!argv.deploy) {
  browserSync({
    server: 'build',
    files: ['src/*.md', 'templates/*.jade', 'assets/*.css'],
    middleware: function (req, res, next) {
      build(next);
    }
  });
} else {
  build(function () {
    console.log('Done building.');
  })
}

function build(callback) {
  metalsmith(__dirname)
    .metadata({
      moment,
      site: {
        title: "Till's Year",
        subtitle: "One year. One picture a day.",
        url: 'https://tillsyear.com',
        author: 'Till Gartner'
      }
    })
    .source('src')
    .destination('build')
    .clean(true) // Clean the target dir before building
    .use(drafts())
    .use(collections({
      articles: {
        pattern: 'articles/**/*.md',
        sort: 'date',
        reverse: true
      }
    }))
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
    //.use(inplace(true))
    .build(function (err) {
      var message = err ? err : 'Build complete';
      console.log(new Date(), message);
      callback();
    });
}