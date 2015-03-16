(function() {
  'use strict';

  angular.module('omtApp', [
    'ngMaterial',
    'ui.router',
    'leaflet-directive',
    'omt.controllers',
    'omt.services'
  ])
  .config(['$mdThemingProvider', '$stateProvider', '$urlRouterProvider', config])
  .run(['$rootScope', '$mqtt', '$data', function($rootScope, $mqtt, $data) {
    $rootScope.$data = $data;
    $rootScope.$storage = $data.storage;
    if (typeof $data.storage.username !== 'undefined') {
      console.log('reconnect using existing username ' + $data.storage.username);
      $mqtt.connect($data.storage.username);
    } else {
      console.log('username is empty ' + $data.storage.username);
    }
  }])
  .filter('dump', function() {
    return function(object) {
      return JSON.stringify(object, null, '  ');
    };
  });

  function config($mdThemingProvider, $stateProvider, $urlRouterProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('light-blue');

    $urlRouterProvider.otherwise('/');

    $stateProvider

    .state('tracking', {
      url: '/',
      templateUrl: 'partials/main.html',
      controller: 'MainCtrl'
    })

    .state('marker', {
      url: '/marker',
      templateUrl: 'partials/marker.html',
      controller: 'MarkerCtrl'
    });
  }

}
)();
