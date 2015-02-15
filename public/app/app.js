'use strict';

angular.module('omtApp', [
  'ngSanitize',
  'ui.bootstrap',
  'ui.select',
  'ui.router',
  'leaflet-directive',
  'omt.controllers'
])
.config(['$stateProvider', '$urlRouterProvider', config]);

function config($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider

  .state('main', {
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
