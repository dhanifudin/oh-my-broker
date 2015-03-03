var fs = require('fs');
var mysql = require('mysql');
var options = JSON.parse(fs.readFileSync('./database.json', 'utf-8'));

var pool = mysql.createPool(options);

var Persistence = function() {};

/* Level {{{ */
Persistence.prototype.getLevels = function(cb) {
  pool.getConnection(function(err, connection) {
    connection.query('SELECT * FROM level', function(err, rows) {
      connection.release();
      cb(err, rows);
    });
  });
};
/* }}} Level */

/* Location {{{ */
Persistence.prototype.contains = function(location, point, cb) {
  pool.getConnection(function(err, connection) {
    var data = [
      location,
      point.latitude,
      point.longitude
    ];
    connection.query(
      'SELECT * FROM location WHERE code = ? AND st_contains(geo, POINT(?, ?))',
      data,
      function(err, rows) {
        cb(err, rows);
    });
  });
};
/* }}} Location */

/* Base Function {{{ */
Persistence.prototype.execute = function(query, data, cb) {
  pool.getConnection(function(err, connection) {
    connection.query(query, data, function(err, rows) {
      cb(err, rows);
    });
  });
};

Persistence.prototype.getWithFilter = function(table, filter, cb) {
  var data = [
    table,
    filter
  ];
  this.execute(
    'SELECT * FROM ?? WHERE ?',
    data,
    cb
  );
};

Persistence.prototype.get = function(table, cb) {
  this.getWithFilter(table, 1, cb);
};

Persistence.prototype.insert = function(table, data, cb) {
  this.execute(table, data, cb);
};
/* }}} Base Function */

module.exports = new Persistence();
