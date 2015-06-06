'use strict';

var restify = require('restify');
var Q = require('q');
var join = require('path').join;
var jwt = require('jwt-simple');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;

require('../prototype')();

var config = require(join(process.cwd(), '.tig'));
var githubBody = config.api.github.authorization;
var githubClient = restify.createJsonClient('https://api.github.com');

exports.authorize = function(opts) {
  var deferred = Q.defer();
  githubBody.note = 'tig access token for ' + opts.username;
  githubClient.basicAuth(opts.username, opts.password);
  client.post('/authorizations', githubBody, function (err, req, res, data) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(data);
    }
  });
  return deferred.promise;
};