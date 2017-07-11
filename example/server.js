// Load the postgres library
var pg = require('pg');
var dbConnection = "pg://" + process.env.DATABASE_USR + ":" + process.env.DATABASE_PWD + "@" + process.env.DATABASE_URL + "/postgres";
// "postgres://username:password@localhost/database"

// Load the restify library
var restify = require('restify');

var server = restify.createServer({
  name: 'example',
  version: '1.0.0'
});

var serviceUrl = process.env.SERVICE_URL + ":" + process.env.SERVICE_PORT;
var client = restify.createJsonClient(serviceUrl);


// Configure our HTTP server to respond with Hello World on a root request
server.get('/', function(req, res, next) {
  res.send(200, "Hello from " + process.argv[2] + " on " + Date());
  next();
});

server.get('/ping', function(req, res, next) {
  res.send({instance: process.argv[2], version: server.versions,  status: "OK",  timestamp: Date()});
  next();
});

server.get('/test', function(req, res, next) {
  var db = new pg.Client(dbConnection);
  console.log('Database: %j', dbConnection)
  db.connect(function(err) {
    var results = '';
    if (err) {
      results = 'could not connect to postgres: ' + err.message;
    } else {
      db.query('SELECT NOW() AS "theTime"', function(err, result) {
        if (err) {
          results = 'error running query: ' + err.message;
        } else {
          results = result.rows[0].theTime;
          db.end();
        }
        console.log('Database returned: %j', results);
        res.send({results: results});
        next();
      });
    }
  });
});

server.get('/service', function(req, res, next) {
  console.log('Service: %j', serviceUrl);
  client.get('/ping', function(error, request, response, data) {
    if (!error) {
      console.log('Service returned: %j', data);
      res.send(200, data);
      next();
    } else {
      console.log(error.message);
    }
  });
});

server.listen(8080, function() {
  console.log('%s:%s listening at %s', server.name, server.versions, server.url);
});
