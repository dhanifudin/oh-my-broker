/* Services Declaration {{{ */
angular.module('omt.services', ['ngResource'])
.factory('sharedLocation', sharedLocation)
.factory('rest', ['$resource', rest])
.factory('mqttService', ['$rootScope', mqttService]);
/* }}} Services Declaration */

/* sharedLocation {{{ */
function sharedLocation() {
  var location = {};
  var layers = {};
  var layer = {};

  return {
    location: location,
    layers: layers,
    layer: layer
  };
}
/* }}} sharedLocation */

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
function mqttService($rootScope) {

  return {
    mqtt: function(username) {
      var options = {
        clientId: 'webtrack_' + username
      };
      return mqtt.connect(options);
    }
  };

  /* var service = { */
  /*   connect: connect */
  /*   publish: publish, */
  /*   subscribe: subscribe, */
  /*   unsubscribe: unsubscribe */
  /* }; */

  function connect() {
    var client = mqtt.connect();
    client.on('message', function(topic, payload) {
      $rootScope.$broadcast('trackEvent', {
        topic: topic,
        message: payload
      });
    });
  }

  function publish(topic, message) {
    client.publish(topic, message);
  }

  function subscribe(topic) {
    client.subscribe(topic);
  }

  function unsubscribe(topic) {
    client.unsubscribe(topic);
  }

  /* return service; */
}
/* }}} mqttService */
