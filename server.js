var restify = require('restify');
var join = require('path').join;
var config=require(join(process.env.USERPROFILE || process.env.HOME, 'tig'));
var

server = restify.createServer();
server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.CORS());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());

server.get('/', restify.serveStatic({
  directory: './lib',
  default: 'index.html'
}));

// POST: username|organization

function authorizeGithub(client, body, cb) {
  client.post('/authorizations', body, function(err, req, res, obj) {
    cb(obj);
  });
}
server.post('/:username', function (req, res, next) {
  var username=req.params.username;
  if(req.authorization && req.authorization.basic && req.authorization.basic.password) {
    var password=req.authorization.basic.password;
    var note='tig access token for ' + username;
    var body = {
      "scopes": ["public_repo", "write:public_key"],
      "note": note
    };
    var githubClient = restify.createJsonClient('https://api.github.com');
    githubClient.basicAuth(username, password);
    authorizeGithub(githubClient, body, function(obj) {
      var errors = [];
      if(obj.errors && obj.errors.length > 0) {
        if(obj.errors[0].code === "already_exists") {
          errors.push({
            "resource": "github",
            "code": "already_exists"
          })
        }
      }

      if(errors.length > 0) {
        res.send({
          "message": "Authorization Failed",
          "errors": errors
        });
      }
      else {
        res.send(obj);
      }
      next();
    });

    //res.send('basic auth: ' + username + ':' + password);
  }
  else {
    // look for token
  }
});


server.listen(3000);

/*
.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('tig-link is up.');
  res.end();
}).listen(3000);
*/

//MONGO: mongodb://<dbuser>:<dbpassword>@ds043062.mongolab.com:43062/tig

console.log('tig-link started on 3000.');

