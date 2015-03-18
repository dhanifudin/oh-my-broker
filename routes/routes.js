var express = require('express');
var persistence = require('../lib/persistence');
var router = express.Router();

router.get('/', function(req, res) {
  res.json('ok');
});

router.post('/', function(req, res) {
  var data = [
    req.body.geo
  ];
  console.log(data);

  persistence.execute(
    'INSERT INTO route SET `timestamp` = unix_timestamp(),\
    geo = GeomFromText(?)',
    data,
    function(err, rows) {
      res.json(rows);
    }
  );
});

module.exports = router;
