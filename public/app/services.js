/* Services Declaration {{{ */
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
/* }}} Services Declaration */

/* data {{{ */
function data($localStorage, $sessionStorage) {

  var tracking = {};
  var marker = {};

  $localStorage.$default({
    tracking: {},
    marker: {}
  });

  $sessionStorage.$default({
    tracking: {},
    marker: {}
  });

  return {
    tracking: tracking,
    marker: marker,
    local: $localStorage,
    session: $sessionStorage
  };

}
/* }}} data */

/* rest {{{ */
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
/* }}} rest */

/* mqttService {{{ */
function mqttService($rootScope, $data) {

  var local = $data.local;
  var session = $data.session;

  /* return { */
  /*   mqtt: function(username) { */
  /*     var options = { */
  /*       clientId: 'webtrack_' + username */
  /*     }; */
  /*     return mqtt.connect(options); */
  /*   } */
  /* }; */

  var service = {
    connect: function(username) {
      var options = {
        clientId: 'webtrack_' + username
      };
      return mqtt.connect(options);
    },
    publish: publish,
    subscribe: subscribe,
    unsubscribe: unsubscribe
  };

  /* function connect(username) { */
  /*   var options = { */
  /*     clientId: 'webtrack_' + username */
  /*   }; */
  /*   return mqtt.connect(options); */
    /* local.tracking.client.on('message', function(topic, payload) { */
    /*   $rootScope.$broadcast('trackEvent', { */
    /*     topic: topic, */
    /*     message: payload */
    /*   }); */
    /* }); */
  /* } */

  function publish(topic, message) {
    if (typeof(local.tracking.client) != 'undefined') {
      local.tracking.client.publish(topic, message);
    }
  }

  function subscribe(topic) {
    if (typeof(local.tracking.client) != 'undefined') {
      local.tracking.client.subscribe(topic);
    }
  }

  function unsubscribe(topic) {
    if (typeof(local.tracking.client) != 'undefined') {
      local.tracking.client.unsubscribe(topic);
    }
  }

  return service;
}
/* }}} mqttService */
