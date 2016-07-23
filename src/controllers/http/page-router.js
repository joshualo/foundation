/**
 * page-router.js
 * routes to render pages
 */

'use strict';

var express = require('express')
  , _ = require('lodash')
  , auth = require('../../libs/auth')
  , logger = require('../../libs/logger')
  ;

var pageRouter = module.exports = express.Router();

// routes
pageRouter
  .get('/', getHome);

function getHome(req, res, next) {
  return res.render('../views/home.jade');
}
