'use strict';

var Q = require('q');
var jwt = require('jwt-simple');
require('../prototype')();

module.exports = function (server) {
  var config = server.settings.config;
  var secret = config.jwt.secret;
  var githubApi = require('./github')(server);
  var mongoUsers = require('../mongo/users')(server);

  return {
    authorize: function (auth, body) {
      var deferred = Q.defer();
      if (auth.basic) {

        githubApi.authorize(auth).then(function (githubRes) {

          console.log('--github response--');
          console.dir(githubRes);
          var errors = [];
          if (githubRes.errors && githubRes.errors.length > 0) {
            errors = _.map(githubRes.errors, function (n) {
              return {
                "resource": "github",
                "code": n.code
              };
            });
          }

          // TODO: Other auths here

          if (errors.length > 0) {
            deferred.reject({
              "message": "Authorization Failed",
              "errors": errors
            });
          } else {
            var nowDate = new Date();
            var expireDate = nowDate.addDays(7);
            var payload = {
              "iss": "https://tig.link",
              "sub": username,
              "aud": "https://tig.link/" + username,
              "exp": expireDate / 1000,
              "iat": nowDate / 1000
            };
            var accessToken = jwt.encode(payload, secret);
            var user = {
              "username": username,
              "jwt": jwt,
              "access_token": accessToken,
              "github_token": githubRes.token,
              "github_hashed_token": githubRes.hashed_token,
              "github_token_last_eight": githubRes.token_last_eight,
              "github_note": githubRes.note,
              "github_note_url": githubRes.note_url,
              "github_created": githubRes.created_at,
              "github_updated": githubRes.updated_at,
              "github_scopes": githubRes.scopes,
              "github_fingerprint": githubRes.fingerprint
            };

            mongoUsers.save(user).then(function () {
              deferred.resolve(accessToken);
            });
          }
        });
      } else if (auth.bearer) {
        try {
          jwt.decode(auth.bearer.token, secret);
          deferred.resolve(auth.bearer.token);
        }
        catch (err) {
          deferred.reject(err);
        }
      }
      return deferred.promise;
    }
  };

};
