/**
 * authHTTP.js
 * authentication middleware
 */

'use strict';

var auth = require('../../../libs/auth')
  , error = require('http-errors')
  ;

var authHTTP = module.exports;

/**
 * HTTP middleware to verify tokens for routes
 *
 * @param {Obj} req - the request object
 * @param {Obj} res - the response object
 * @callback {String} route - the route to skip to next; bipassing all other middleware
 */
authHTTP.validateToken = (req, res, next) => {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    return next(new error.Forbidden('No token provided.'));
  }

  if (token) {
    auth.validateToken(token, (err, user) => {
      if (err) {
        next(err)
      }

      req.user = user;
      next();
    })
  } 
};
