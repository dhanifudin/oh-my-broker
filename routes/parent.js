var express = require('express');
var persistence = require('../lib/persistence');
var router = express.Router();

router.get('/', function(req, res, next) {
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

router.get('/:id', function(req, res, next) {
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

module.exports = router;
