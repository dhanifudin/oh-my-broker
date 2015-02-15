var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  req.getConnection(function(err, conn) {
    conn.query(
      'SELECT id, name FROM level where id <> 1',
      function(err, rows) {
      if (err)
        console.log('Error selecting: %s', err);
      res.json(rows);
    });
  });
});

module.exports = router;

