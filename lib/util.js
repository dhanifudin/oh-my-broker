var Util = function() {};

Util.prototype.getUserId = function(clientId) {

};

Util.prototype.filter = function(users, track) {
  console.log('Filter function');
};

Util.prototype.dump = function(obj) {
  var text = JSON.stringify(obj, null, '  ');
  console.log(text);
};

module.exports = new Util();
