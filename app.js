/* Modules declaration {{{ */
var moscaHandler = require('./lib/mosca_handler');
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
var level = require('./routes/level');
app.use('/api/levels', level);
app.use('/api/locations', location);
/* }}} ExpressJS configuration */

moscaHandler.attachServer(httpServer, 8000);
