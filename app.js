/* vim: set foldmethod=marker: */

/* Modules declaration {{{ */
var broker = require('./lib/broker');
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var httpServer = http.createServer(app);
/* }}} Modules declaration */

/* ExpressJS configuration {{{ */
// Configure bodyparser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup static page directory
app.use(express.static(path.dirname(require.resolve('mosca')) + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// Routing
var location = require('./routes/location');
var routes = require('./routes/routes');
var level = require('./routes/level');
var parent = require('./routes/parent');
app.use('/api/levels', level);
app.use('/api/routes', routes);
app.use('/api/locations', location);
app.use('/api/parents', parent);
/* }}} ExpressJS configuration */

broker.attachServer(httpServer);
