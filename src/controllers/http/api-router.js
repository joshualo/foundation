/**
 * api-router.js
 * routes for resources returned in JSON
 */

'use strict';

var express     = require('express')
  , authHTTP = require('../http/middleware/auth')
  , auth = require('../../libs/auth')
  , User = require('../../models/user')
  ;

var apiRoutes = module.exports = express.Router()

apiRoutes
  .post('/users', postUsers)
  .get('/users', [authHTTP.validateToken, getUsers])
  .post('/authenticate', postAuthenticate)
  ;

function postUsers(req, res, next) {
  var user = {
    userName: req.body.userName,
    password: req.body.password
  };

  User.create(user, (err, user) => {
    if (err) {
      return next(err)
    }

    res.status(200).send({ success: true });
  });
}

function getUsers(req, res, next) {
  var userQuer = req.params;

  User.getUsers(userQuer, (err, users) => {
    if (err) {
      return next(err)
    }

    res.status(200).send(users)
  });
}

function postAuthenticate(req, res, next) {
  var user = {
    userName: req.body.userName
  }

  var password = req.body.password;

  User.getUser(user, (err, user) => {
    if (err) {
      return next(err)
    }

    auth.authenticate(password, user.password, user, (err, token) => {
      if (err) {
        return next(err)
      }

      res.status(200).send({ success: true, token });
    });
  });
}
