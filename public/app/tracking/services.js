angular.module('omt.services', ['ngResource', 'ngStorage'])
.factory('$data', [
  '$localStorage',
  '$sessionStorage',
  data
])
.factory('$rest', [
  '$resource',
  rest
])
.factory('$mqtt', [
  '$rootScope',
  '$data',
  mqttService
]);

function data($localStorage, $sessionStorage) {

  var tracking = {};
  var marker = {};
  var client = null;

  $localStorage.$default({
    subscriptions: [],
    joined: false
  });

  $sessionStorage.$default({
  });

  function reset() {
    $localStorage.$reset();
    client = null;
  }

  return {
    tracking: tracking,
    marker: marker,
    client: client,
    storage: $localStorage,
    session: $sessionStorage,
    reset: reset
  };
}

function rest($resource) {
  var level = $resource(
    '/api/levels/:id', { id: '@_id' }, {
      'index': { method: 'GET', isArray: true }
    }
  );

  var location = $resource(
    '/api/locations/:id', { id: '@_id' }, {
      'create': { method: 'POST' },
      'index': { method: 'GET', isArray: true },
      'parent': { method: 'GET', isArray: true },
      'show': { method: 'GET', isArray: false },
      'update': { method: 'PUT' },
      'destroy': { method: 'DELETE' }
    }
  );

  var parent = $resource(
    '/api/parents/:id', { id: '@_id' }, {
      'index': { method: 'GET', isArray: true },
      'show': {method: 'GET', isArray: true}
    }
  );

  return {
    level: level,
    location: location,
    parent: parent
  };
}

function mqttService($rootScope, $data) {

  var local = $data.local;
  var session = $data.session;
  var username = $data.username;

  var service = {
    connect: connect,
    publish: publish,
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    end: end,
  };

  function connect(username) {
    var options = {
      clientId: 'webtrack_' + username
    };
    $data.client = mqtt.connect(options);
    // Listen for event connect
    $data.client.on('connect', function() {
      $rootScope.$apply(function() {
        $data.joined = true;
      });
      $data.client.subscribe(username);
    });

    $data.client.on('message', function(topic, payload) {
      $rootScope.$broadcast('trackEvent', {
        topic: topic,
        message: payload
      });
    });

    $data.client.on('close', function() {
      $rootScope.$apply(function() {
        $data.joined = false;
      });
    });
  }

  function publish(topic, message) {
    if ($data.client !== null) {
      $data.client.publish(topic, message);
    }
  }

  function subscribe(topic) {
    if ($data.client !== null) {
      $data.client.subscribe(topic);
    }
  }

  function unsubscribe(topic) {
    if ($data.client !== null) {
      $data.client.unsubscribe(topic);
    }
  }

  function end() {
    if ($data.client !== null) {
      $data.client.end();
    }
  }

  return service;
}
