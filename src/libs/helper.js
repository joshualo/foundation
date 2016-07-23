/**
 * helper.js
 * utility functions
 */

'use strict';

var helper = module.exports
  ;

/**
 * check if the app is running in 'production' mode
 *
 * @return {Boolean} - if running in production
 */
helper.isProd = function() {
  return process.env.NODE_ENV === 'production';
}

/**
 * check if the app is running in 'development' mode
 *
 * @return {Boolean} - if running in development
 */
helper.isDevel = function() {
  return process.env.NODE_ENV === 'development';
}

helper.isMongoDBDuplicateError = function(err) {
  return err.code === 11000 || err.code === 11001;
}