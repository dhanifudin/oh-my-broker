angular.module('omt.controllers', ['omt.services'])
.controller('MainCtrl', ['$rootScope', '$scope', 'mqttService', mainCtrl]);

function mainCtrl($rootScope, $scope, mqttService) {
  $scope.connect = function() {
    var client = mqttService.mqtt('icub');
    /* var client = mqtt.connect(); */
    /* client.subscribe('hello'); */

    /* client.on('message', function(topic, payload) { */
    /*   $scope.message = [topic, payload].join(": "); */
    /* }); */

    /* client.publish('hello', 'hello from angular'); */
  }
}
