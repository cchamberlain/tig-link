'use strict';

var paths = require('./etc/paths');
var config=require(paths.TIG_LINK_JSON_PATH);

var server = restify.createServer();
server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.CORS());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.use(restify.bodyParser({ mapParams: false }));

require('./lib')(server);

server.listen(config.port);
console.log('tig-link started on ' + config.port + '.');
