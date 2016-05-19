var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/test'); //may not be right filepath
var db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
  // we're connected!


// db.db.listCollections({name: 'urlSchema'})
//   .next((err, collinfo) => {
//     if (err) {
      // var urlsSchema = mongoose.Schema({
      //   url: String,
      //   baseUrl: String,
      //   code: String,
      //   title: String,
      //   visits: Number,
      //   date: {type: Date, default: Date.now}
      // });
  //   }
  // }); 

// db.db.listCollections({name: 'usersSchema'})
//   .next((err, collinfo) => {
//     if (err) {

  //   }
  // }); 

// });

// var path = require('path');
// var knex = require('knex')({
//   client: 'sqlite3',
//   connection: {
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   },
//   useNullAsDefault: true
// });
// var db = require('bookshelf')(knex);

// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('baseUrl', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
// //   }
// });

module.exports = db; 

