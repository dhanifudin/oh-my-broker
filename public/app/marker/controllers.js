angular.module('marker.controllers', [])

.controller('AppCtrl', [
  '$rootScope',
  '$scope',
  '$mdDialog',
  '$mdToast',
  '$timeout',
  '$data',
  'leafletData',
  appCtrl
])

.controller('LocationDialog', [
  '$mdDialog',
  '$timeout',
  '$data',
  '$rest',
  locationDialog
]);

function appCtrl($rootScope, $scope, $mdDialog, $mdToast, $timeout, $data, leafletData) {

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

  this.showToast = function(message) {
    $mdToast.show(
      $mdToast.simple()
        .content(message)
        .hideDelay(2000)
    );
  };

  leafletData.getMap().then(mapHandler);

  function mapHandler(map) {
    L.Icon.Default.imagePath = 'img';
    var drawnItems = $scope.controls.edit.featureGroup;

    map.on('draw:created', function(e) {
      var layer = e.layer;
      $data.location.geo = polygonToText(layer.toGeoJSON());

      $mdDialog.show({
        controller: 'LocationDialog as dialog',
        templateUrl: 'dialogs/location.html',
      }).then(ok, cancel);

      function ok() {
        that.showToast($data.location.name + ' has been created');
        layer.bindLabel($data.location.name).addTo(map);
        drawnItems.addLayer(layer);
        $data.location = {};
      }

      function cancel() {
        that.showToast('You canceled the dialog');
        console.log('You canceled the dialog');
        $data.location = {};
      }
    });

    var routing = L.Routing.control({
      routeWhileDragging: true,
      waypoints: [
        L.latLng(-7.283188972010171, 112.79238224029541),
        L.latLng(-7.278846903849963, 112.79789686203003)
      ]
    }).addTo(map);

    routing.on('routesfound', function(e) {
      var confirm = $mdDialog.confirm()
        .title('Would you like to save this route?')
        .ok('Save')
        .cancel('Cancel');
        $mdDialog.show(confirm).then(function() {
          console.log('Save');
        }, function() {
          console.log('Cancel');
        });
    });

    routing.on('routingerror', function(e) {
      console.log(e);
    });
  }

  function polygonToText(geojson) {
    var coordinates = [];
    geojson.geometry.coordinates[0].forEach(function(geo) {
      coordinates.push(geo.join(' '));
    });
    return 'POLYGON(' + coordinates.join(', ') + '))';
  }

}

function locationDialog($mdDialog, $timeout, $data, $rest) {

  this.save = function() {
    console.log(e);
  };

  this.cancel = function() {
    $mdDialog.cancel();
  };
}
