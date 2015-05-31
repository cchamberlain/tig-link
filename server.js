var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('tig-link is up.');
  res.end();
}).listen(80);

console.log('tig-link started on 80.');
