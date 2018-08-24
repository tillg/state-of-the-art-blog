const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const logger = require('./util_log').moduleLogger(module);

/**
 * Creates the directory for the file that has been passed. ASYNC, returns a Promise.
 * Note: You pass in a filename, we create the Directory (not the file!)
 * @param {} filePath
 */
const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);

  const promise = new Promise((resolve, reject) => {
    mkdirp(dirname, (err) => {
      if (err) {
        logger.error(`ensureDirectoryExistence: Could not mkdirp directory for ${filePath} : ${err.message}`);
        reject(err);
      } else {
        // logger.verbose('ensureDirectoryExistence: Successfully created ' + dirname);
        resolve(dirname);
      }
    });
  });
  return promise;
};

/**
 * Erases a dir with all sub-dirs and files inside. ASYNC returns a promise.
 */
const eraseDir = dirname => new Promise((resolve, reject) => {
  rimraf(dirname, (err) => {
    if (err) {
      reject(err);
    }
    resolve(dirname);
  });
});

/**
 * Checks wether a file exists. A directory also counts as file here. ASYNC, returns a Promise.
 * @param {*} filepath
 */
const fileExists = (filepath) => {
  const promise = new Promise((resolve, reject) => {
    fs.stat((filepath), (err, stats) => {
      if (err) {
        return err.code === 'ENOENT'
          ? resolve(false)
          : reject(err);
      }
      resolve(stats.isFile() && stats.isDirectory());
      return null;
    });
  });
  return promise;
};

/**
 * Makes a directory name as string from a URL where this article would belong. SYNC
 * @param {*} url
 */
const makeDirectoryNameFromUrl = (url) => {
  let dirName = url;

  // Let's strip the ending
  const lastChar = url.substr(url.length - 1);
  if (lastChar === '/') {
    dirName = dirName.substr(0, dirName.length - 1);
  }

  // Strip away http(s) and //
  dirName = dirName.replace('https:', '');
  dirName = dirName.replace('http:', '');
  dirName = dirName.replace('//', '');

  // Replace all / with _
  while (dirName.includes('/')) {
    dirName = dirName.replace('/', '_');
  }

  // Replace all . with _
  while (dirName.includes('.')) {
    dirName = dirName.replace('.', '_');
  }

  // Strip out all :
  while (dirName.includes(':')) {
    dirName = dirName.replace(':', '');
  }

  // Strip away leading and trailing _
  dirName = dirName.replace(/^_+|_+$/g, '');

  return dirName;
};

/**
 * Makes a valid filename string from a URL. The filename does not contain a path,
 * no file extension and no other special characters than _.
 * Example http://whatever.com/index.html --> whatever_com_index
 * @param {*} url
 */
const makeBaseFilenameFromUrl = (url) => {
  // Let's save the ending for later
  let ending = url.substr(url.length - 1);
  let frontPartOfUrl = '';
  if (ending !== '/') {
    const pieces = url.split(/[.\/]+/);
    ending = pieces[pieces.length - 1];
    frontPartOfUrl = url.substr(0, url.length - ending.length - 1);
  } else {
    frontPartOfUrl = url.substr(0, url.length - 1);
  }

  // As front part of the filename we use the same logic as for building the
  // directory name
  const filename = makeDirectoryNameFromUrl(frontPartOfUrl);
  return filename;
};

/**
 * Makes a valid filename string from a URL. The filename does not contain a path,
 * and an extension that matches the URL: html or jpg or...
 * Example http://whatever.com/index.html --> whatever_com_index.html
 * @param {*} url
 */
const makeFilenameFromUrl = (url) => {
  // Let's save the ending for later
  let ending = url.substr(url.length - 1);
  if (ending !== '/') {
    const pieces = url.split(/[.\/]+/);
    ending = pieces[pieces.length - 1];
  } else {
    ending = 'html';
  }
  const filename = `${makeBaseFilenameFromUrl(url)}.${ending}`;
  return filename;
};

/**
 * Writes content to disk. ASYNC, returns a Promise containing the file name.
 * @param {*} resourceContent
 * @param {*} filename including the path
 */
const writeResourceToFile = (filename, resourceContent) => ensureDirectoryExistence(filename)
  .then(() => new Promise((resolve, reject) => {
    fs.writeFile(filename, resourceContent, (err) => {
      if (err) {
        logger.error(err.message);
        reject(err);
      } else {
        // logger.verbose('Successfully wrote file ' + filename);
        resolve(filename);
      }
    });
  }))
  .catch((err) => {
    logger.error(err.message);
    throw (err);
  });

/**
 * Writes content to disk. SYNC.
 * Note: Fails if the directory does not exist!
 * @param {*} resourceContent
 * @param {*} filename including the path
 */
const writeResourceToFileSync = (filename, resourceContent) => {
  fs.writeFileSync(filename, resourceContent);
};

/**
 * Reads a resource from Disk. ASYNC returns a promise.
 * @param {*} filename
 */
const readResourceFromFile = filename => new Promise((resolve, reject) => {
  fs.readFile(filename, (err, data) => {
    if (err) {
      logger.error(err.message);
      reject(err);
    }
    resolve(data);
  });
});

/**
 * Reads a resource from Disk. SYNC.
 * @param {*} filename
 */
const readResourceFromFileSync = filename => fs.readFileSync(filename);

/**
 * Writes an object to disk in a serialized manner. ASYNC, returns a Promise.
 * @param {*} obj
 * @param {*} filename
 */
const writeObjectToFile = (obj, filename) => {
  const str = JSON.stringify(obj);
  return writeResourceToFile(filename, str);
};

/**
 * Writes an object to disk in a serialized manner. SNC.
 * @param {*} obj
 * @param {*} filename
 */
const writeObjectToFileSync = (obj, filename) => {
  const str = JSON.stringify(obj);
  return writeResourceToFileSync(filename, str);
};

/**
 * Reads an object from a file in which it has been serialized. ASYNC, returns a promise.
 * @param {*} filename
 */
const readObjectFromFile = filename => readResourceFromFile(filename)
  .then((data) => {
    const obj = JSON.parse(data);
    return obj;
  })
  .catch((err) => {
    logger.error(err.message);
    throw err;
  });

/**
 * Reads an object from a file in which it has been serialized. SYNC.
 * @param {*} filename
 */
const readObjectFromFileSync = (filename) => {
  const fileData = readResourceFromFileSync(filename);
  return JSON.parse(fileData);
};

module.exports = {
  writeObjectToFile,
  writeObjectToFileSync,
  readObjectFromFile,
  readObjectFromFileSync,
  writeResourceToFile,
  eraseDir,
  fileExists,
  makeFilenameFromUrl
};
