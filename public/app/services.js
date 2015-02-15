angular.module('omt.services', [])
.factory('mqttService', ['$rootScope', mqttService]);

/* mqttService {{{ */
function mqttService($rootScope) {

  return {
    mqtt: function(username) {
      var options = {
        clientId: 'webtrack_' + username
      };
      return mqtt.connect(options);
    }
  }

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
