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
]);

function data() {

  var location = {};

  return {
    location: location
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

  var parent = $resource(
    '/api/parents/:id', { id: '@_id' }, {
      'index': { method: 'GET', isArray: true },
      'show': {method: 'GET', isArray: true}
    }
  );

  return {
    level: level,
    location: location,
    parent: parent
  };
}
