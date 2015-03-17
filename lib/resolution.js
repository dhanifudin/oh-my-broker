var persistence = require('./persistence');

var Resolution = function() {};

Resolution.prototype.getLocation = function(from, to) {
  getRelation(from, to, function(level) {
    console.log(level);
  });
};

function print(level) {
  switch(level) {
    case 1:
      break;
    case 2:
      break;
    case 3:
      break;
    case 4:
      break;
    default:
  }
}

function getRelation(from, to, cb) {
  var data = [
    from,
    to
  ];

  persistence.execute(
    'SELECT relation_level FROM relationship \
    INNER JOIN user u1 ON u1.id = relation_from \
    INNER JOIN user u2 ON u2.id = relation_to \
    WHERE u1.username = ? AND u2.username = ?',
    data,
    function(err, rows) {
      var level = (err) ? 0 : rows[0].relation_level;
      cb(level);
    }
  );
}

module.exports = new Resolution();
