/**
 * Metalsmith plugin to 'calculate' the header picture and titles
 *
 * @return {Function}
 */
const debug = require('debug')('pluginSetPageHeaders');

function plugin() {
  const setPageHeaders = (files, metalsmith, done) => {
    setImmediate(done);
    Object.keys(files).forEach((file) => {
      const data = files[file];
      const pageHeaders = {};
      const metadata = metalsmith.metadata();

      // Index page is treated a part
      if (data.template === 'index.jade') {
        pageHeaders.picture = metadata.site.headerPicture;
        pageHeaders.title = metadata.site.title;
        pageHeaders.subtitle = metadata.site.subtitle;
      } else if (data.noPicture) {
        pageHeaders.picture = null;
        pageHeaders.title = null;
        pageHeaders.subtitle = null;
      } else if (data.picture) {
        pageHeaders.picture = data.picture;
        pageHeaders.title = ' ';
        pageHeaders.subtitle = ' ';
      } else {
        pageHeaders.picture = metadata.site.headerPicture;
        pageHeaders.title = metadata.site.title;
        pageHeaders.subtitle = metadata.site.subtitle;
      }

      data.pageHeaders = pageHeaders;
      debug(`PageHeaders set: ${JSON.stringify(data.pageHeaders)}`);
    });
  };
  return setPageHeaders;
}

/**
 * Expose `plugin`.
 */
module.exports = plugin;
