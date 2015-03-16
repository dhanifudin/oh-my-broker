(function() {
  'use strict';

  angular.module('markerApp', [
    'ngMaterial',
    'leaflet-directive',
    'marker.controllers',
    'marker.services'
  ])

  .config([
    '$mdThemingProvider',
    config
  ])

  .filter('dump', function() {
    return function(object) {
      return JSON.stringify(object, null, '  ');
    };
  })

  .run([
    '$rootScope',
    '$data',
    run
  ]);

  function config($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('light-blue');
  }

  function run($rootScope, $data) {
    /* $rootScope.$storage = $data.storage; */
    /* $rootScope.$session = $data.session; */
  }

})();
