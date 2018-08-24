/**
 * Metalsmith plugin to 'calculate' the header picture and titles
 *
 * @return {Function}
 */
const debug = require('debug')('pluginSetPageHeaders');
const path = require('path');
const { URL } = require('url');

const absolutify = (myUrl, siteUrl) => {
  const siteUrlAsURL = new URL(siteUrl);
  if (path.isAbsolute(myUrl)) {
    // eslint-disable-next-line
    const newUrl = siteUrlAsURL.protocol + '//' + siteUrlAsURL.host + '/' + siteUrlAsURL.pathname + myUrl; 
    return newUrl
  };
  return myUrl;
};

const plugin = (siteUrl) => {
  if (!siteUrl) throw new Error('Plugin setPageHeaders must be called with a siteUrl.');

  const setPageHeaders = (files, metalsmith, done) => {
    setImmediate(done);
    Object.keys(files).forEach((file) => {
      const data = files[file];
      const pageHeaders = {};
      const metadata = metalsmith.metadata();

      // Index page is treated a part
      if (data.template === 'index.jade') {
        pageHeaders.picture = absolutify(metadata.site.headerPicture, siteUrl);
        pageHeaders.title = metadata.site.title;
        pageHeaders.subtitle = metadata.site.subtitle;
      } else if (data.noPicture) {
        pageHeaders.picture = null;
        pageHeaders.title = null;
        pageHeaders.subtitle = null;
      } else if (data.picture) {
        pageHeaders.picture = absolutify(data.picture, siteUrl);
        pageHeaders.title = ' ';
        pageHeaders.subtitle = ' ';
      } else {
        pageHeaders.picture = absolutify(metadata.site.headerPicture, siteUrl);
        pageHeaders.title = metadata.site.title;
        pageHeaders.subtitle = metadata.site.subtitle;
      }

      data.pageHeaders = pageHeaders;
      debug(`PageHeaders set: ${JSON.stringify(data.pageHeaders)}`);
    });
  };
  return setPageHeaders;
};

/**
 * Expose `plugin`.
 */
module.exports = plugin;
