var fs = require('fs');
var mysql = require('mysql');
var options = JSON.parse(fs.readFileSync('./database.json', 'utf-8'));

var pool = mysql.createPool(options);

var Persistence = function() {};

Persistence.prototype.getLevels = function(cb) {
  pool.getConnection(function(err, connection) {
    connection.query('SELECT * FROM level', function(err, rows) {
      connection.release();
      cb(err, rows);
    });
  });
}

module.exports = new Persistence;
