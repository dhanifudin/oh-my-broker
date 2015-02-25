/* Modules declaration {{{ */
/* var mosca = require('mosca'); */
var moscaHandler = require('./lib/mosca_handler');
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var httpServer = http.createServer(app);
/* }}} Modules declaration */

/* Settings {{{ */
var fs = require('fs');
/* var moscaSettings = JSON.parse(fs.readFileSync('mosca.json', 'utf-8')); */
var databaseSettings = JSON.parse(fs.readFileSync('database.json', 'utf-8'));
/* var mongoUrl = moscaSettings.backend.url; */
/* }}} Settings */

/* Mosca configuration {{{ */
/* var server = new mosca.Server(moscaSettings); */
/* server.on('ready', moscaHandler.onReady); */
/* server.on('clientConnected', moscaHandler.onClientConnected); */
/* server.on('published', moscaHandler.onPublished); */
/* server.on('published', function(packet, client) { */
/*   console.log([packet.topic, packet.payload].join(": ")); */
/*   if (packet.topic === 'tracks') { */
/*     server.publish({ */
/*       topic: 'icub', */
/*       payload: packet.payload */
/*     }); */
/*   } */
/* }); */
/* server.on('subscribed', moscaHandler.onSubscribed); */
/* server.on('clientDisconnected', moscaHandler.onClientDisconnected); */
/* }}} Mosca configuration */

/* Mongo Helpers {{{ */
/* var insertTrack = function(track, db, callback) { */
/*   var collection = db.collection('tracks'); */
/*   collection.insert({value: JSON.parse(track)}, function(err, result) { */
/*     if (err) { */
/*       console.warn('Failed to insert'); */
/*       return; */
/*     } */
/*     callback(result); */
/*   }); */
/* }; */

/* var findTrack = function(filter, db, callback) { */
/*   var collection = db.collection('tracks'); */
/*   collection.find(filter).toArray(function(err, docs) { */
/*     callback(docs); */
/*   }); */
/* }; */
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

/* moscaHandler.server.attachHttpServer(httpServer); */
/* httpServer.listen(8000, function() { */
/*   console.log('Server is listening'); */
/* }); */
moscaHandler.attachServer(httpServer, 8000);
