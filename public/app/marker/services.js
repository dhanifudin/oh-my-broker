angular.module('marker.services', [
  'ngResource',
  'ngStorage'
])

.factory('$data', [
  '$localStorage',
  '$sessionStorage',
  data
])

.factory('$rest', [
  '$resource',
  rest
])

.factory('$myToast', [
  '$mdToast',
  toast
]);

function data() {

  var location = {};
  var route = {};

  return {
    location: location,
    route: route
  };
}

function rest($resource) {

  var level = $resource(
    '/api/levels/:id', { id: '@_id' }, {
      'index': { method: 'GET', isArray: true }
    }
  );

  var location = $resource(
    '/api/locations/:id', { id: '@_id' }, {
      'create': { method: 'POST' },
      'index': { method: 'GET', isArray: true },
      'parent': { method: 'GET', isArray: true },
      'show': { method: 'GET', isArray: false },
      'update': { method: 'PUT' },
      'destroy': { method: 'DELETE' }
    }
  );

  var route = $resource(
    '/api/routes/:id', { id: '@_id' }, {
      'create': {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      'index': { method: 'GET', isArray: true },
      'show': { method: 'GET', isArray: false },
      'update': { method: 'PUT' },
      'destroy': { method: 'DELETE' }
    }
  );

  var parent = $resource(
    '/api/parents/:id', { id: '@_id' }, {
      'index': { method: 'GET', isArray: true },
      'show': {method: 'GET', isArray: true}
    }
  );

  return {
    level: level,
    location: location,
    route: route,
    parent: parent
  };
}

function toast($mdToast) {

  function show(message) {
    $mdToast.show(
      $mdToast.simple()
      .content(message)
      .hideDelay(2000)
    );
  }

  return {
    show: show
  };
}
