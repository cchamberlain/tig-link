'use strict';

var restify = require('restify');

var server = restify.createServer();
server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.CORS());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.use(restify.bodyParser({ mapParams: false }));

require('./lib')(server);

server.listen(server.settings.config.port);
console.log('tig-link started on ' + server.settings.config.port + '.');
