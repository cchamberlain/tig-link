'use strict';

var restify = require('restify');
var _ = require('lodash');
var join = require('path').join;

var config=require(join(process.cwd(), '.tig'));


var server = restify.createServer();
server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.CORS());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());

var identityApi = require('./lib/api/identity');

server.get('/', restify.serveStatic({
  directory: './lib',
  default: 'index.html'
}));

server.post('/', function (req, res, next) {
  var auth = require('./lib/inspectors/auth')(req.authorization);
  if(auth) {
    identityApi.authorize(auth).then(function(identity) {
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

