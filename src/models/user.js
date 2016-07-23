/**
 * user.js
 * manages user model
 */

'use strict';

var mongoose = require('mongoose')
  , bcrypt = require('bcrypt-nodejs')
  , logger = require('../libs/logger')
  , error = require('http-errors')
  , _ = require('lodash')
  ;

var schema = new mongoose.Schema({
  userName: { type: String, trim: true, lowercase: true, required: true, unique: true },
  password: { type: String, trim: true, required: true },
  created: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  userType: { type: Number }
});

//----------
// Pre-validate middleware; additional validation before schema validation and save
//----------

schema.pre('validate', function(next) {
  if (this.isModified()) {
    var now = new Date();

    if (!this.created) {
      this.created = now;
    }

    this.lastUpdated = now;
  }

  next();
});

//----------
// Model library functions
//----------

/**
 * Create a new user
 *
 * @param {Object} user the details of the user
 * @callback {err, user} error or the user
 */
schema.statics.create = function(user, callback) {
  bcrypt.hash(user.password, null, null, (err, hash) => {
    if (err) {
      logger.error('hash error', {class: 'user', function: 'create', error: err});
      return callback(new error.InternalServerError('A system error occured'));
    }

    user.password = hash;
    user = new User(user);

    user.save(err => {
      if (err) {

        if (helper.isMongoDBDuplicateError) {
          return callback(new error.BadRequest('The specified username already exists'));
        }

        logger.error('save error', {class: 'user', function: 'create', err});
        return callback(new error.InternalServerError('A system error occured'));
      }

      callback(null, user);
    });
  });
}

/**
 * Get a user by id
 *
 * @param {Number} id user._id of the user
 * @callback {err, user} error or the user
 */
schema.statics.getUser = function(user, callback) {
  this
    .findOne(user)
    .exec((err, user) => {
      if (err) {
        logger.error('findOne error', {class: 'user', function: 'getById', error: err});
        return callback(new error.InternalServerError('A system error occured'));
      }

      if (!user) {
        logger.warn('no results', {class: 'user', function: 'getUser'});
        return callback(new error.BadRequest('No matching account could be found'));
      }

      callback(null, user)
    });
}

/**
 * Get all users that match user
 *
 * @param {Object} userInfo user query parameters
 * @param {Number} limit number of results to return
 * @param {Number} offset number of results to shift
 * @callback {err, [user]} error or an array of matching users
 */
schema.statics.getUsers = function(userInfo, limit, offset, callback) {
  this
    .find(userInfo)
    .limit(limit)
    .skip(offset)
    .exec((err, users) => {
      if (err) {
        logger.error('find error', {class: 'user', function: 'getUsers', error: err});
        return callback(new error.InternalServerError('A system error occured'));
      }

      users = users || [];
      callback(null, users);
    });
};

/**
 * Save the user
 *
 * @param {Object} user user query parameters
 * @callback {err, user} error or an array of matching users
 */
schema.static.update = function(user, callback) {
  var options = {
    upsert: true, 
    runValidators: true, 
    setDefaultsOnInsert: true,
    new: true
  };

  this.findByIdAndUpdate(user.id, user, options, (err, user) => {
    if (err) {
      if (helper.isMongoDBDuplicateError) {
        return callback(new error.BadRequest('The specified username already exists'));
      }

      logger.error('findByIdAndUpdate error', {class: 'user', function: 'update', err});
      return callback(new error.InternalServerError('A system error occured'));
    }

    callback(null, user);
  });
}

/**
 * Delete the user
 *
 * @param {Object} user user query parameters
 * @callback {err} error if error
 */
schema.static.delete = function(user, callback) {
  this.findByIdAndRemove(user.id, (err) => {
    if (err) {
      logger.error('delete error', {class: 'user', function: 'delete', error: err});
      return callback(new error.InternalServerError('A system error occured'));
    }

    return callback()
  });
}

const User = module.exports = mongoose.model('User', schema);
