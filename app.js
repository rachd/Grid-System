var express = require('express');
var app = express();
var path = require('path');

app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname + '/app/index.html'));
});

app.post('/', function (request, response) {
  // response.send('Got a POST request');
  response.sendFile(path.join(__dirname + '/app/css/main.css'));
});

app.use(express.static('app'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});