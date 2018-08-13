/*jshint esversion: 6 */

const winston = require('winston');
var path = require('path');

/*
  A reminder of our log levels (in winston):
  error: 0, 
  warn: 1, 
  info: 2, 
  verbose: 3, 
  debug: 4, 
  silly: 5 

 */

const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    sql: 4,
    debug: 5
  },
  colors: {
    error: "red",
    warn: "darkred",
    info: "black",
    http: "green",
    sql: "blue",
    debug: "gray"
  }
};
//winston.addColors(logLevels);

const labeledLogger = label => {
  const logger = winston.createLogger({
    level: 'verbose',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(info => {
        return `${info.timestamp} ${info.level}: ${label} - ${info.message}`;
      })
    ),
    transports: [
      new winston.transports.Console({
        name: 'console',
        colorize: true,
        showLevel: true
      })
    ]
  });
  return logger;
};

const logger = labeledLogger('???');

const moduleLogger = module => {
  return labeledLogger(path.basename(module.filename));
};

const getDetailsFromFile = (fileDetails) => {
  const fileAndRow = fileDetails
    .split("at ").pop()
    .split("(").pop()
    .replace(')', '')
    .split(':');

  const detailsFromFile = {
    file: fileAndRow[0].trim(),
    line: fileAndRow[1],
    row: fileAndRow[2],
  };

  detailsFromFile.formattedInfos =
    Object.keys(detailsFromFile).reduce((previous, key) =>
      `${previous}` +
      ` ${key}: ` +
      `${detailsFromFile[key]}`, `\n`
    );

  return detailsFromFile;
};

var getLabel = function (callingModule) {
  var parts = callingModule.filename.split('/');
  return parts[parts.length - 2] + '/' + parts.pop();
};

exports.logger = logger;
exports.labeledLogger = labeledLogger;
exports.moduleLogger = moduleLogger;