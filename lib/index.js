'use strict';

module.exports = function(server) {
  require('./config')(server);
  require('./routes')(server);
  require('./static')(server);
};
