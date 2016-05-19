var mongoose = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
// mongoose.connect('mongodb://localhost/test');

var usersSchema = mongoose.Schema({
  username: String,
  password: String,
  date: {type: Date, default: Date.now}
});

usersSchema.pre('save', function(next) {
  // console.log('inside pre save');
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;// fix this
      // console.log ('return hash;', hash);
      next();
    });
});

var User = mongoose.connection.model('User', usersSchema);





// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function() {
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function() {
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });



module.exports = User;