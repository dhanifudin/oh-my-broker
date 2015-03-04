/* Controllers Declaration {{{ */
angular.module('omt.controllers', ['omt.services'])
.controller('DialogCtrl', [
  '$timeout',
  '$mdDialog',
  'sharedLocation',
  'rest',
  dialogCtrl
])

.controller('AppCtrl', [
  '$scope',
  '$state',
  '$timeout',
  '$mdSidenav',
  appCtrl
])

.controller('MenuLocationCtrl', [
  '$scope',
  '$timeout',
  'sharedLocation',
  'rest',
  menuLocationCtrl
])

.controller('MainCtrl', [
  '$rootScope',
  '$scope',
  'mqttService',
  mainCtrl
])

.controller('LocationCtrl', [
  '$scope',
  '$mdDialog',
  'leafletData',
  'sharedLocation',
  locationCtrl
]);

/* }}} Controller Declarations */

/* Application Controller {{{ */
function appCtrl($scope, $state, $timeout, $mdSidenav) {

  this.isLockedOpen = function() {
    return $state.current.name === 'location' ? '$media(\'gt-sm\')' : false;
  };

  this.isTrackingState = function() {
    return ($state.current.name === 'tracking');
  };

  this.locationState = function() {
    return ($state.current.name === 'location');
  };

  this.toggleMenu = function() {
    $timeout(function() {
      $mdSidenav('left').toggle();
    });
  };

  this.closeMenu = function() {
    $timeout(function() {
      $mdSidenav('left').close();
    });
  };

}
/* }}} Application Controller */

/* Menu Location Controller {{{ */
function menuLocationCtrl($scope, $timeout, sharedLocation, rest) {
  var ctrl = this;

  $scope.location = sharedLocation.location;

  this.levels = rest.level.index();

  /* this.loadLevels = function() { */
  /*   ctrl.levels = rest.level.index(); */
  /*   return ctrl.levels; */
  /*   /1* return $timeout(function() { *1/ */
  /*   /1*   ctrl.levels = rest.level.index(); *1/ */
  /*   /1* }, 650); *1/ */
  /* }; */

  this.loadParents = function() {
    return $timeout(function() {
      ctrl.parents = rest.location.parent($scope.location.level.id);
    }, 1000);
  };

}
/* }}} Menu Location Controller */

/* Tracking Controller {{{ */
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
  };

  $scope.onMessage = function(topic, payload) {
    console.log([topic, payload].join(": "));
  };

  $scope.subscribe = function(topic) {
    $scope.track.client.subscribe(topic);
  };

  $scope.unsubscribe = function(topic) {
    $scope.track.client.unsubscribe(topic);
  }

}/* }}} Tracking Controller */

/* Location Controller {{{ */
function locationCtrl($scope, $mdDialog, leafletData, shared) {
  angular.extend($scope, {
    its: {
      lat: -7.27956,
      lng: 112.79744,
      zoom: 16
    },
    controls: {
      draw: {
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false
      }
    }
  });

  var that = this;

  this.location = shared.location;

  this.polygonToText = function(geojson) {
    var coordinates = [];
    geojson.geometry.coordinates[0].forEach(function(geo) {
      coordinates.push(geo.join(' '));
    });
    return 'POLYGON((' + coordinates.join(', ') + '))';
  }

  leafletData.getMap().then(function(map) {
    var drawnItems = $scope.controls.edit.featureGroup;

    map.on('draw:created', function(e) {
      var layer = e.layer;
      shared.location.geo = that.polygonToText(layer.toGeoJSON());
      $mdDialog.show({
        controller: 'DialogCtrl as dialog',
        templateUrl: 'partials/dialogs/location.html',
      })
      .then(function(answer) {
        layer.bindLabel(shared.location.name).addTo(map);
        drawnItems.addLayer(layer);
        shared.location = {};
      }, function() {
        console.log('You canceled the dialog.');
        shared.location = {};
      });
    });

    map.on('click', function(e) {
      console.log(e.latlng)
    });
  });
}
/* }}} Location Controller */

/* Dialog Controller {{{ */
function dialogCtrl($timeout, $mdDialog, shared, rest) {

  var that = this;

  this.location = shared.location;

  this.levels = rest.level.index();

  this.loadParents = function() {
    that.parents = [];
    return $timeout(function() {
      that.parents = rest.parent.show({id: shared.location.level.id + 1});
    }, 650);
  };

  this.hide = function() {
    $mdDialog.hide();
  };

  this.cancel = function() {
    $mdDialog.cancel();
  };

  this.answer = function(answer) {
    function success(response) {
      console.log('success', response);
      $mdDialog.hide(answer);
    }

    function failure(response) {
      console.log('failure', response);
    }

    rest.location.create(shared.location, success, failure);
  };
}
/* }}} Dialog Controller */
