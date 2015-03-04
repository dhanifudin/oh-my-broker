var express = require('express');
var persistence = require('../lib/persistence');
var router = express.Router();

router.get('/', function(req, res, next) {
  persistence.execute(
    'SELECT * FROM level WHERE id <> 1',
    null,
    function(err, rows) {
      if (err)
        console.log('Error selecting: %s', err);
      res.json(rows);
    }
  );
});

router.get('/parents/:id', function(req, res, next) {
  var data = [
    req.params.id
  ];
  persistence.execute(
    'SELECT id, name FROM location WHERE level_id = ?',
    data,
    function(err, rows) {
      res.json(rows);
    }
  );
});

router.post('/', function(req, res, next) {
  var data = [
    req.body.code,
    req.body.name,
    req.body.level.id,
    (req.body.parent) ? req.body.parent.id : null,
    req.body.geo,
    req.body.geo
  ];
  console.log(data);
  persistence.execute(
    'INSERT INTO location set code = ?, name = ?, level_id = ?, parent_id = ?,\
    geo = PolyFromText(?), center = Centroid(PolyFromText(?))',
    data,
    function(err, rows) {
      res.json(rows);
    }
  );
});

module.exports = router;
