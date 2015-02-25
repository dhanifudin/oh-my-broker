var fs = require('fs');
var mosca = require('mosca');
var users = {};
var persistence = require('./persistence');

var moscaSettings = JSON.parse(fs.readFileSync('mosca.json', 'utf-8'));
var server = new mosca.Server(moscaSettings);

var MoscaHandler = function() {};

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function(str) {
    return this.slice(0, str.length) == str;
  };
}

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
  console.log(users);
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
    console.log(users);
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
            server.publish({
              topic: user,
              payload: payload
            });
            return;
          }
        });
      }
    }
  });
}

function addSubscriptions(clientId, subscription) {
  var s = JSON.parse(subscription);
  var user = getUserId(clientId);
  if (typeof(users[user].subscriptions) == 'undefined') {
    users[user].subscriptions = [];
  }
  users[user].subscriptions.push(s.subscription);
  console.log(users);
}

server.on('ready', onReady);
server.on('clientConnected', onClientConnected);
server.on('published', onPublished);
server.on('subscribed', onSubscribed);
server.on('clientDisconnected', onClientDisconnected);

MoscaHandler.prototype.attachServer = function(httpServer, port) {
  httpServer.listen(port, function() {
    console.log('Server is listening');
  });
}

module.exports = new MoscaHandler;
