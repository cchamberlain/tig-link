'use strict';

module.exports = function(server) {
  server.settings = server.settings || {};
  server.settings.paths = require('../../etc/paths');
  server.settings.config = require(server.settings.paths.TIG_LINK_JSON_PATH);
};