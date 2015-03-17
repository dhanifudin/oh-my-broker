angular.module('marker.controllers', [])

.controller('AppCtrl', [
  '$rootScope',
  '$scope',
  '$mdDialog',
  '$mdToast',
  '$timeout',
  '$data',
  '$rest',
  'leafletData',
  appCtrl
])

.controller('LocationDialog', [
  '$mdDialog',
  '$mdToast',
  '$timeout',
  '$data',
  '$rest',
  locationDialog
]);

function appCtrl($rootScope, $scope, $mdDialog, $mdToast, $timeout, $data, $rest, leafletData) {

  var that = this;
  leafletData.getMap().then(mapHandler);

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

  this.showToast = function(message) {
    $mdToast.show(
      $mdToast.simple()
        .content(message)
        .hideDelay(2000)
    );
  };

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
          if (e.routes.length) {
            console.log(getCoordinates(e.routes[0].coordinates));
            $rest.route.create(
              getCoordinates(e.routes[0].coordinates),
              function(response) {
                that.showToast('Success: ' + response);
              },
              function(response) {
                that.showToast('Fail: ' + response);
              }
            );
          } else {
            that.showToast('Empty routes');
          }
        }, function() {
          that.showToast('Cancel');
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
    return 'POLYGON((' + coordinates.join(', ') + '))';
  }

  function getCoordinates(array) {
    var coordinates = [];
    array.forEach(function(location) {
      coordinates.push({
        lat: location[0],
        lon: location[1]
      });
    });
    return JSON.stringify({ geos: coordinates });
  }

}

function locationDialog($mdDialog, $mdToast, $timeout, $data, $rest) {

  var that = this;

  this.location = $data.location;

  this.levels = $rest.level.index();

  this.loadParents = function() {
    that.parents = [];
    return $timeout(function() {
      that.parents = $rest.parent.show({id: $data.location.level.id + 1});
    }, 650);
  };

  this.showToast = function(message) {
    $mdToast.show(
      $mdToast.simple()
      .content(message)
      .hideDelay(2000)
    );
  };

  this.save = function() {
    $rest.location.create(
      $data.location,
      function(response) {
        $mdDialog.hide();
        that.showToast('Success: ' + response);
      },
      function(response) {
        that.showToast('Fail: ' + response);
      }
    )
  };

  this.cancel = function() {
    $mdDialog.cancel();
  };

}
