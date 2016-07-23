/**
 * auth.js
 * authentication service
 */

'use strict';

var config = require('config')
  , helper = require('../libs/helper')
  , logger = require('../libs/logger')
  , error = require('http-errors')
  , jwt = require('jsonwebtoken')
  , bcrypt = require('bcrypt-nodejs')
  , User = require('../models/user')
  ;

var auth = module.exports;

/**
 * authenticate credentials and return an access token
 *
 * @param {String} password - password provided for authentication
 * @param {Object} cert - a cert string to validate against
 * @param {Object} payload - an object to tokenize
 * @callback {Object, String} error - the error object, token - the access token
 */
auth.authenticate = (password, cert, payload, callback) => {
  bcrypt.compare(password, cert, (err, isValid) => {
    if (err) {
      logger.error('bcrypt compare error', {class: 'auth', function: 'getToken', error: err});
      return callback(new error.InternalServerError('A system error occured'));
    }

    if (!isValid) {
      logger.warn('invalid credentials', {class: 'auth', function: 'getToken', error: err});
      return callback(new error.Unauthorized('Invalid username or password'));
    }

    this.generateToken(payload, (err, token) => {
      callback(null, token);
    })
  });
}

/**
 * generate an access token
 *
 * @param {Object} payload - an object to tokenize
 * @callback {null, String} token - the access token
 */
auth.generateToken = (payload, callback) => {
  var tokenOptions = {
    expiresIn: config.get('auth.expiresIn')
  }

  jwt.sign(payload, config.get('auth.secret'), tokenOptions, (err, token) => {
    if (err) {
      return callback(new error.InternalServerError('A system error occured'));
    }

    callback(err, token)
  });
}

/**
 * verify if the token is valid
 *
 * @param {String} token - the access token
 * @callback {Object, Object} error - the error object, payload - the payload object from the token
 */
auth.validateToken = (token, callback) => {
  jwt.verify(token, config.get('auth.secret'), (err, payload) => {
    if (err) {
      return callback(new error.Forbidden('Failed to authenticate token.'));
    }

    return callback(err, payload)
  });
}
