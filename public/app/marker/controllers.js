angular.module('marker.controllers', [])

.controller('AppCtrl', [
  '$rootScope',
  '$scope',
  '$mdDialog',
  '$timeout',
  '$data',
  '$rest',
  '$myToast',
  'leafletData',
  appCtrl
])

.controller('LocationDialog', [
  '$mdDialog',
  '$timeout',
  '$data',
  '$rest',
  '$myToast',
  locationDialog
]);

function appCtrl($rootScope, $scope, $mdDialog, $timeout, $data, $rest, $myToast, leafletData) {

  leafletData.getMap().then(mapHandler);

  angular.extend($scope, {
    its: {
      lat: -7.27956,
      lng: 112.79744,
      zoom: 16
    },
    controls: {
      draw: {
        rectangle: false,
        circle: false,
        marker: false
      }
    }
  });

  function mapHandler(map) {
    L.Icon.Default.imagePath = 'img';
    var drawnItems = $scope.controls.edit.featureGroup;

    map.on('draw:created', function(e) {
      switch(e.layerType) {
        case 'polyline':
          polylineHandler(e.layer);
          break;
        case 'polygon':
          polygonHandler(e.layer);
          break;
      }

      function polylineHandler(layer) {
        $data.route.geo = geomToText('MULTIPOINT', layer.toGeoJSON());

        var confirm = $mdDialog.confirm()
          .title('Would you like to save this route?')
          .ok('Save')
          .cancel('Cancel');

        $mdDialog.show(confirm)
          .then(function() {
            $rest.route.create(
              $data.route,
              function(response) {
                $myToast.show('Success: ' + response);
              },
              function(response) {
                $myToast.show('Fail: ' + response);
              }
            )
          }, function() {
            $myToast.show('Cancel');
            $data.route = {};
          });
      }

      function polygonHandler(layer) {
        $data.location.geo = geomToText('POLYGON', layer.toGeoJSON());

        $mdDialog.show({
          controller: 'LocationDialog as dialog',
          templateUrl: 'dialogs/location.html'
        }).then(ok, cancel);

        function ok() {
          $myToast.show($data.location.name + ' has been created');
          layer.bindLabel($data.location.name).addTo(map);
          drawnItems.addLayer(layer);
          $data.location = {};
        }

        function cancel() {
          $myToast.show('You canceled the dialog');
          $data.location = {};
        }

      }

    });

  }

  function geomToText(type, geojson) {
    var coordinates = [];
    switch(type) {
      case 'POLYGON':
        geojson.geometry.coordinates[0].forEach(function(geo) {
          coordinates.push(geo.join(' '));
        });
        return type + '((' + coordinates.join(', ') + '))';
      case 'MULTIPOINT':
        geojson.geometry.coordinates.forEach(function(geo) {
          coordinates.push(geo.join(' '));
        });
        return type + '(' + coordinates.join(', ') + ')';
    }
  }

}

function locationDialog($mdDialog, $timeout, $data, $rest, $myToast) {

  var that = this;

  this.location = $data.location;

  this.levels = $rest.level.index();

  this.loadParents = function() {
    that.parents = [];
    return $timeout(function() {
      that.parents = $rest.parent.show({id: $data.location.level.id + 1});
    }, 650);
  };

  this.save = function() {
    $rest.location.create(
      $data.location,
      function(response) {
        $mdDialog.hide();
        $myToast.show('Success: ' + response);
      },
      function(response) {
        $myToast.show('Fail: ' + response);
      }
    )
  };

  this.cancel = function() {
    $mdDialog.cancel();
  };

}
