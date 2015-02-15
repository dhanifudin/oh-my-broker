if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function(str) {
    return this.slice(0, str.length) == str;
  };
}
/* Variables declaration {{{ */
var mongo = require('mongodb').MongoClient;
var mosca = require('mosca');
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var httpServer = http.createServer(app);
/* }}} Variables declaration */

/* Data Structures {{{ */
var users = {};
/* }}} Data Structures */

/* Settings {{{ */
var fs = require('fs');
var moscaSettings = JSON.parse(fs.readFileSync('mosca.json', 'utf-8'));
var databaseSettings = JSON.parse(fs.readFileSync('database.json', 'utf-8'));
var mongoUrl = moscaSettings.backend.url;
/* }}} Settings */

/* Mosca configuration {{{ */
var server = new mosca.Server(moscaSettings);
server.on('ready', setup);
server.on('clientConnected', onClientConnected);
server.on('published', onPublished);
server.on('subscribed', onSubscribed);
server.on('clientDisconnected', onClientDiconnected);
/* }}} Mosca configuration */

/* Mosca Events Handler {{{ */
function setup() {
  console.log('Mosca server is up and running');
}

function onClientConnected(client) {
  var id = client.id;
  if (id.startsWith('webtrack_') || id.startsWith('droidtrack_')) {
    var user= id.substr(id.indexOf('_') + 1);
    if (typeof(users[user]) == 'undefined') {
      users[user] = {};
      users[user][id] = id;
    } else {
      users[user][id] = id;
    }
    console.log(users);
  }
  console.log('Client connected:', id);
}

function onPublished(packet, client) {
  console.log(packet.topic);
  if (packet.topic === 'tracks') {
    mongo.connect(mongoUrl, function(err, db) {
      insertTrack(packet.payload, db, function() {
        db.close();
      });
    });
  }
}

function onSubscribed(topic, client) {
  console.log('Client ' + client.id + 'subscribed on ' + topic);
}

function onClientDiconnected(client) {
  var id = client.id;
  if (id.startsWith('webtrack_') || id.startsWith('droidtrack_')) {
    var user = id.substr(id.indexOf('_') + 1);
    delete users[user][id];
  }
  console.log('Client disconnected:', client.id);
}
/* }}} Mosca Events Handler */

/* Mongo Helpers {{{ */
var insertTrack = function(track, db, callback) {
  var collection = db.collection('tracks');
  collection.insert({value: JSON.parse(track)}, function(err, result) {
    callback(result);
  });
};

var findTrack = function(filter, db, callback) {
  var collection = db.collection('tracks');
  collection.find(filter).toArray(function(err, docs) {
    callback(docs);
  });
};
/* }}} Mongo Helpers */

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
});
/* }}} ExpressJS configuration */

server.attachHttpServer(httpServer);
httpServer.listen(8000, function() {
  console.log('Server is listening');
});
