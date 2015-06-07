var restify = require('restify');

module.exports = function (server) {
  server.get('/', restify.serveStatic({
    directory: './srv',
    default: 'index.html'
  }));
};
