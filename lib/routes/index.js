'use strict';

var restify = require('restify');
var identityApi = require('../api/identity');

module.exports = function (server) {
  server.post('/', function (req, res, next) {
    var auth = require('../inspectors/auth')(req.authorization);
    if (auth) {
      identityApi.authorize(auth, req.body).then(function (identity) {
        res.send(identity);
        next();
      }, function (err) {
        next(new restify.InvalidCredentialsError(err));
      });
    } else {
      next(new restify.UnauthorizedError("No authorization header set"));
    }
  });
};
