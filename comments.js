// create a web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var comments = require('./comments');
var querystring = require('querystring');

var server = http.createServer(function (req, res) {
  // parse the request url
  var url_parts = url.parse(req.url);
  var pathname = url_parts.pathname;

  // handle the request
  switch (req.method) {
    case 'GET':
      if (pathname === '/') {
        // read the html file
        fs.readFile('./index.html', function (err, data) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        });
      } else if (pathname === '/comments') {
        comments.read(function (err, data) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(data));
        });
      }
      break;
    case 'POST':
      if (pathname === '/comments') {
        var data = '';
        req.on('data', function (chunk) {
          data += chunk;
        });
        req.on('end', function () {
          var comment = querystring.parse(data).comment;
          comments.create(comment, function (err) {
            if (err) console.error(err);
            res.writeHead(200);
            res.end();
          });
        });
      }
      break;
    default:
      res.writeHead(404);
      res.end();
  }
});

server.listen(3000, function () {
  console.log('Server started');
});
