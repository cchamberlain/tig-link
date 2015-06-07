'use strict';

var restify = require('restify');
var Q = require('q');

require('../prototype')();

module.exports = function (server) {
  var config = server.settings.config;
  var githubBody = config.api.github.authorization;
  var githubClient = restify.createJsonClient('https://api.github.com');

  return {
    authorize: function (opts) {
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
    }
  }
};
