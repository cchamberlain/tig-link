'use strict';

var restify = require('restify');
var q = require('q');
var join = require('path').join;
var jwt = require('jwt-simple');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;

require('../prototype')();

var config = require(join(process.cwd(), '.tig'));
var mongoConnection = config.connections.mongo;
var githubBody = config.api.github.authorization;
var githubClient = restify.createJsonClient('https://api.github.com');


exports.authorize = function (opts, cb) {
  var deferred = q.defer();

  authorizeGithub(opts).then(function (githubRes) {
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
      var jwtPayload = {
        "iss": "https://tig.link",
        "sub": username,
        "aud": "https://tig.link/" + username,
        "exp": expireDate / 1000,
        "iat": nowDate / 1000
      };
      var accessToken = jwt.encode(jwtPayload, config.jwt.secret);
      var user = {
        "_id": new ObjectID(username),
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


      mongodb.MongoClient.connect(mongoConnection, function (err, db) {
        if (err) {
          deferred.reject(err);
        } else {
          var collection = db.collection('users');
          collection.save(user, function (err) {
            if (err) {
              deferred.reject(err);
            } else {
              deferred.resolve({
                "access_token": accessToken
              });
            }
          });
        }
      });
    }
  });
  return deferred.promise;
};

function authorizeGithub(opts) {
  var deferred = q.defer();
  githubBody.note = 'tig access token for ' + opts.username;
  githubClient.basicAuth(opts.username, opts.password);
  client.post('/authorizations', githubBody, function (err, req, res, data) {
    if (err) {
      deferred.reject(err);
    }
    deferred.resolve(data);
  });
  return deferred.promise;
}