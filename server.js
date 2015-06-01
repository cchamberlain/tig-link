var restify = require('restify');
var join = require('path').join;
var mongodb = require('mongodb');
var _ = require('lodash');

var config=require(join(__dirname || process.cwd(), '.tig'));
var mongoConnection=config.connections.mongo;
var githubConfig=config.api.github;

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
    var authBody=githubConfig.authorization;
    authBody.note='tig access token for ' + username;
    var githubClient = restify.createJsonClient('https://api.github.com');
    githubClient.basicAuth(username, password);
    authorizeGithub(githubClient, authBody, function(githubRes) {
      console.log('--github response--');
      console.dir(githubRes);
      var errors = [];
      if(githubRes.errors && githubRes.errors.length > 0) {
        errors = _.map(githubRes.errors, function(n) {
          return {
            "resource": "github",
            "code": n.code
          };
        });
      }

      if(errors.length > 0) {
        res.send({
          "message": "Authorization Failed",
          "errors": errors
        });
        next();
      }
      else {
        var ObjectID=mongodb.ObjectID;
        var user = {
          "_id": new ObjectID(username),
          "username": username,
          "github_token": githubRes.token,
          "github_hashed_token": githubRes.hashed_token,
          "github_token_last_eight": githubRes.token_last_eight,
          "github_note": githubRes.note,
          "github_note_url": githubRes.note_url,
          "github_created": githubRes.created_at,
          "github_updated": githubRes.updated_at,
          "github_scopes": githubRes.scopes,
          "github_fingerprint": githubRes.fingerprint
        };

        mongodb.MongoClient.connect(mongoConnection, function(err, db) {
          if(err)  {
            console.log(err);
            throw err;
          }

          var collection = db.collection('users');
          collection.save(user, function (err) {
            if(err) throw err;

            res.send(githubRes);
            next();
          });
        });
      }
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

