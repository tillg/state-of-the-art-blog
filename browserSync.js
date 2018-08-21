const browserSync = require('browser-sync');

browserSync({
  server: 'build',
  files: ['build/*.html'],
  reloadDelay: 1000,
});
