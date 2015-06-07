'use strict';

var q = require('q');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;

require('../prototype')();

module.exports = function (server) {
  var config = server.settings.config;
  var mongoConnection = config.connections.mongo;

  return {
    save: function (user) {
      var deferred = q.defer();
      mongodb.MongoClient.connect(mongoConnection, function (err, db) {
        if (err) {
          deferred.reject(err);
        } else {
          var collection = db.collection('users');
          user["_id"] = new ObjectID(user.username);
          collection.save(user, function (err) {
            if (err) {
              deferred.reject(err);
            } else {
              deferred.resolve(user);
            }
          });
        }
      });
      return deferred.promise;
    }
  }
};
