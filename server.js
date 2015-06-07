'use strict';

var restify = require('restify');
var _ = require('lodash');
var join = require('path').join;

var TIG_ROOT=process.env.TIG_HOME || join(process.env.HOME || process.env.USERPROFILE, ".tig");
var TIGRC_PATH=join(TIG_ROOT, "tigrc");
var TIG_LINK_PATH=join(TIG_ROOT, "tig-link.json");

var config=require(TIG_LINK_PATH);


var server = restify.createServer();
server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.CORS());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.use(restify.bodyParser({ mapParams: false }));

var identityApi = require('./lib/api/identity');

server.get('/', restify.serveStatic({
  directory: './lib',
  default: 'index.html'
}));

server.post('/', function (req, res, next) {
  var auth = require('./lib/inspectors/auth')(req.authorization);
  if(auth) {
    identityApi.authorize(auth, req.body).then(function(identity) {
      res.send(identity);
      next();
    }, function(err) {
      next(new restify.InvalidCredentialsError(err));
    });
  } else {
    next(new restify.UnauthorizedError("No authorization header set"));
  }
});

server.listen(config.port);
console.log('tig-link started on ' + config.port + '.');

