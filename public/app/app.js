'use strict';

angular.module('omtApp', [
  'ngMaterial',
  'ngMdIcons',
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

  .state('location', {
    url: '/location',
    templateUrl: 'partials/location.html',
    controller: 'LocationCtrl'
  });
}
