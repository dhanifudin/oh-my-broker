var fs = require('fs');
var async = require('async');
var mosca = require('mosca');
var persistence = require('./persistence');
var util = require('./util');
var users = {};

var moscaSettings = JSON.parse(fs.readFileSync('mosca.json', 'utf-8'));
var server = new mosca.Server(moscaSettings);

var Broker = function() {};

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function(str) {
    return this.slice(0, str.length) == str;
  };
}

server.on('ready', onReady);
server.on('clientConnected', onClientConnected);
server.on('published', onPublished);
server.on('subscribed', onSubscribed);
server.on('clientDisconnected', onClientDisconnected);

function onReady() {
  console.log('Mosca server is up and running');
}

function onClientConnected(client) {
  addUser(client.id);
}

function onPublished(packet, client) {
  console.log([packet.topic, packet.payload].join(': '));
  switch(packet.topic) {
    case 'tracks':
      filter(client, packet.payload);
      console.log('Filter this');
      break;
    case 'subscriptions':
      addSubscriptions(client.id, packet.payload);
      console.log('add subscriptions');
      break;
  }
}

function onSubscribed(topic, client) {
  console.log('Client ' + client.id + ' subscribed on ' + topic);
}

function onClientDisconnected(client) {
  var id = client.id;
  if (id.startsWith('webtrack_') || id.startsWith('droidtrack_')) {
    var user = getUserId(id);
    delete users[user][id];
  }
  console.log('Client disconnected:', client.id);
  /* console.log(users); */
  util.dump(users);
}

function getUserId(clientId) {
  return clientId.substr(clientId.indexOf('_') + 1);
}

function addUser(clientId) {
  if (clientId.startsWith('webtrack_') || clientId.startsWith('droidtrack_')) {
    var user= clientId.substr(clientId.indexOf('_') + 1);
    if (typeof(users[user]) == 'undefined') {
      users[user] = {};
    }
    users[user][clientId] = clientId;
    /* console.log(users); */
    util.dump(users);
  }
  console.log('Client connected:', clientId);
}

function filter(client, payload) {
  var exceptUser = getUserId(client.id);
  var track = JSON.parse(payload);

  var username = track.username;
  var latitude = track.latitude;
  var longitude = track.longitude;

  Object.keys(users).forEach(function(user) {
    console.log('current user: ' + user);
    if (user !== exceptUser) {
      var subscriptions = users[user].subscriptions;
      if (typeof(subscriptions) != 'undefined') {
        subscriptions.every(function(subscription) {
          if (eval(subscription)) {
            console.log('subscription match, notify tracker: ' + user)
            server.publish({
              topic: user,
              payload: payload
            });
            return;
          }
        });
      } else {
        console.log('skip evaluate track from same user');
      }
    }
  });
}

function contains(location, point) {
  var result = false;
  async.series([
    persistence.contains(location, point, function(err, rows) {
      if (err)
        return;
      result = rows.length > 0 ? true : false;
    })
  ]);
  return result;
}

function addSubscriptions(clientId, subscription) {
  var s = JSON.parse(subscription);
  var user = getUserId(clientId);
  if (typeof(users[user].subscriptions) == 'undefined') {
    users[user].subscriptions = [];
  }
  users[user].subscriptions.push(s.subscription);
  /* console.log(users); */
  util.dump(users);
}

Broker.prototype.attachServer = function(httpServer) {
  server.attachHttpServer(httpServer);
  httpServer.listen(moscaSettings.httpPort, function() {
    console.log('Server is listening');
  });
};

module.exports = new Broker();
