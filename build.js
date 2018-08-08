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

// If I run node run deploy --prod, it should not use browser-sync to watch for changes.
// Otherwise, it should.
console.log(argv);
if (!argv._.includes('deploy')) {
  browserSync({
    server: 'build',
    files: ['src/*.md', 'templates/*.jade', 'assets/*.css'],
    middleware: function (req, res, next) {
      build(next, 'http://localhost:3000');
    }
  });
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
        title: "State of the art Blog",
        subtitle: "Blogging the way a tech guy does it in 2018",
        url: siteUrl ? siteUrl : 'https://tillg.github.io/state-of-the-art-blog',
        author: 'Till Gartner',
        // Just ommit the twitter, facebook or github link if you don't want those. The logos & links will simply not show up.
        twitterLink: 'https://twitter.com/tillg',
        facebookLink: 'https://www.facebook.com/till.gartner',
        githubLink: 'https://github.com/tillg'
      }
    })
    .source('src')
    .destination('build')
    .clean(true) // Clean the target dir before building
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
    //.use(inplace(true))
    .build(function (err) {
      var message = err ? err : 'Build complete';
      console.log(new Date(), message);
      callback();
    });
}