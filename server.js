var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var http = require('http');
var app = express();

var api = require('./server/api');

app.use(express.static(path.join(__dirname,'dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', api);
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

var port = process.env.PORT || '3000';
app.set('port', port);

var server = http.createServer(app);
server.listen(port, function(){console.log('Server is running')});
