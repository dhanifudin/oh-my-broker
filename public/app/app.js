'use strict';

angular.module('omtApp', [
  'ngRoute',
  'omt.controllers'
])
.config(['$routeProvider', config]);

function config($routeProvider) {
  $routeProvider

  .when('/', {
    templateUrl: 'partials/main.html',
    controller: 'MainCtrl'
  })

  .otherwise({
    redirectTo: '/'
  });
}
