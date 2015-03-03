var express = require('express');
var persistence = require('../lib/persistence');
var router = express.Router();

router.get('/', function(req, res) {
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

module.exports = router;
