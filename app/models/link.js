var mongoose = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose'); 
// mongoose.connect('mongodb://localhost/test');

var linksSchema = mongoose.Schema({
  url: String,
  baseUrl: String,
  code: String,
  visits: Number,
  date: {type: Date, default: Date.now}
});

linksSchema.pre('save', function(next) {
  if (!this.code) {
    var shasum = crypto.createHash('sha1');
    shasum.update(this.url);
    this.code = shasum.digest('hex').slice(0, 5);
  }
  next(); //try set if doesnt work
});

var Link = mongoose.connection.model('Link', linksSchema);


// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

module.exports = Link;
