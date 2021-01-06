var mongoose = require('mongoose');
mongoose.connect('YOUR MONGODB SERVER', { useNewUrlParser: true });
var db = mongoose.connection;
db.once('open', function () {
  console.log("mongodb connection succeed");
});

mongoose.Promise = global.Promise;

module.exports = { db };
