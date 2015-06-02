'use strict';

var restify = require('restify');
var q = require('q');
var join = require('path').join;
var jwt = require('jwt-simple');

require('../prototype')();

// Get supported auths
module.exports = function(auth) {
  var auths = {
    basic: auth.basic ? auth.basic : null,
    bearer: auth.scheme === "Bearer" ? {
      token: auth.credentials
    } : null
  };
  return auths.basic || auths.bearer ? auths : null;
};
