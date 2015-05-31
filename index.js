var util = require('util'),
  http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('tig-link is up.');
  res.end();
}).listen(3000);

/* server started */
util.puts('> tig-link running on port 3000');