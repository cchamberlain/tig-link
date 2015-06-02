'use strict';

var q = require('q');
var join = require('path').join;
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;

require('../prototype')();

var config = require(join(process.cwd(), '.tig'));
var mongoConnection = config.connections.mongo;

exports.save = function (user) {
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
};