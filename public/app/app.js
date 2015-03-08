(function() {
  'use strict';

  angular.module('omtApp', [
    'ngMaterial',
    'ui.router',
    'leaflet-directive',
    'omt.controllers'
  ])
  .config(['$mdThemingProvider', '$stateProvider', '$urlRouterProvider', config])
  .run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$state = $state;
  }]);

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
