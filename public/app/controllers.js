angular.module('omt.controllers', ['omt.services'])
.controller('MainCtrl', ['$rootScope', '$scope', 'mqttService', mainCtrl])
.controller('LocationCtrl', ['$rootScope', '$scope', locationCtrl]);

function mainCtrl($rootScope, $scope, mqttService) {

  angular.extend($scope, {
    its: {
      lat: -7.27956,
      lng: 112.79744,
      zoom: 16
    },
    markers: {},
    events: {}
  });

  $scope.track = {
    client: null,

    status: {
      error: null,
      started: false
    },

    data: {
      username: null
    }
  };

  $scope.init = function() {
    if ($scope.username) {
      var client = mqttService.mqtt($scope.username);
      client.subscribe($scope.username);

      client.on('message', $scope.onMessage);

      $scope.track.client = client;
      $scope.track.status.joined = true;
    }
  }

  $scope.onMessage = function(topic, payload) {
    console.log([topic, payload].join(": "));
  }

  $scope.subscribe = function(topic) {
    $scope.track.client.subscribe(topic);
  }

  $scope.unsubscribe = function(topic) {
    $scope.track.client.unsubscribe(topic);
  }

}

function locationCtrl($rootScope, $scope) {

}
