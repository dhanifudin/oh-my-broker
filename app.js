/* Variables declaration {{{ */
var mosca = require('mosca');
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var httpServer = http.createServer(app);
/* }}} Variables declaration */

/* Settings {{{ */
var fs = require('fs');
var moscaSettings = JSON.parse(fs.readFileSync('mosca.json', 'utf-8'));
var databaseSettings = JSON.parse(fs.readFileSync('database.json', 'utf-8'));
/* }}} Settings */

/* Mosca configuration {{{ */
var server = new mosca.Server(moscaSettings);
server.on('ready', setup);

server.on('clientConnected', function(client) {
  console.log('Client connected:', client.id);
});

server.on('published', function(packet, client) {
  console.log(packet.topic);
});

server.on('subscribed', function(topic, client) {
  console.log('subscribed');
});

server.on('clientDisconnected', function(client) {
  console.log('Client disconnected:', client.id);
});

function setup() {
  console.log('Mosca server is up and running');
}
/* }}} Mosca configuration */

/* ExpressJS configuration {{{ */
// Configure bodyparser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup static page directory
app.use(express.static(path.dirname(require.resolve('mosca')) + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// Database configuration
var connection = require('express-myconnection');
var mysql = require('mysql');
app.use(connection(mysql, databaseSettings, 'request'));

// Routing
var location = require('./routes/location');
var level = require('./routes/level');
app.use('/api/levels', level);
app.use('/api/locations', location);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/test', function(req, res) {
  res.render('test success');
})
/* }}} ExpressJS configuration */

server.attachHttpServer(httpServer);
httpServer.listen(8000, function() {
  console.log('Server is listening');
});
