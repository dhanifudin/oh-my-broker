var express = require('express');
var persistence = require('../lib/persistence');
var router = express.Router();

router.get('/', function(req, res) {
  res.json('ok');
});

router.post('/', function(req, res) {
  var params = {
    geos: req.body.geos
  };

  persistence.execute(
    'INSERT INTO route VALUES(null, unix_timestamp())',
    null,
    function(err, rows) {
      console.log(rows.insertId);
      params.geos.forEach(function(geo) {
        var data = {
          route_id: rows.insertId,
          lat: geo.lat,
          lon: geo.lon
        };
        persistence.execute(
          'INSERT INTO geo SET ?',
          data,
          function(err1, rows1) {
            console.log(rows1);
          }
        );
      });
      res.json('oye');
    }
  );
});

module.exports = router;
