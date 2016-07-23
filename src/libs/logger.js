/**
 * logger.js
 * thin wrapper around winston
 */

'use strict';

/**
 * logging levels:
 * error (0) - a system component was unable to fullfill a request
 * warn (1) - a request resulted in unexpected results
 * info (2) - logging basic information for analysis
 * verbose (3) - logging of extended information for analysis
 * debug (4) - development
 * silly (5) - not used
 */

var winston = require('winston')
  , mongodb = require('winston-mongodb').MongoDB
  , dailyRotateFile = require('winston-daily-rotate-file')
  , config = require('config')
  , path = require('path')
  ;

// default console transport
var logger = module.exports = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: config.devel ? 'debug' : 'warn',
      stderrLevels: ['error', 'warn'],
      handleExceptions: true,
      humanReadableUnhandledException: true,
      json: false,
      colorize: true
    })
  ]
});

logger.on('error', function (err) {
  console.error('!!! logger error !!! - err=' + err);
});

// optional mongoDB transport
if (config.get('logger.mongoDB.enabled')) {
  logger.add(winston.transports.MongoDB, {
    level: 'info',
    db : config.mongoLocation,
    handleExceptions: true,
    collection: 'logs'
  });
}

// optional daily rotating file transport
if (config.get('logger.dailyRotateFile.enabled')) {
  logger.add(dailyRotateFile, {
    level: 'info',
    datePattern: '.yyyyMMdd',
    filename: path.join(config.get('logger.dailyRotateFile.logDirectory'), 'web.log'),
    handleExceptions: true,
    json: true,
    maxsize: config.logging.maxFileSize,
    maxFiles: config.logging.maxFiles,
    colorize: false
  })
}