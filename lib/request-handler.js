var request = require('request'); 
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
var Users = require('../app/collections/users');
var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({ url: '*' }, (err, links) => {
    console.log('this is links in fetchLinks find:', links);
    res.status(200).send(links);
  });
  // Links.reset().fetch().then(function(links) {
  //   res.status(200).send(links.models);
  // });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;
  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  Link.findOne({ url: uri }).exec((err, link) => {
    if (link) {
      console.log('inside link found in saveLink link.find');
      console.log('this is link in saveLink link.find:', link);
      res.status(200).send(link); //check later
    } else {
      console.log('inside link not found in link.find');
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });
        newLink.save().then(function(newLink) {
          console.log('newLink:', newLink);
          res.status(200).send(newLink);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  // console.log('this is username in loginUser: ', username);
  var password = req.body.password;

  User.findOne({ 'username': username}).exec((err, user) => {
    if (!user) {
      // console.log('inside user not found in loginUser');
      // console.log('user inside user not found:', user);
      res.redirect('/login');
    } else {
      // console.log('this is user in loginUser after its found:', user);
      bcrypt.compare(password, user.password, function(err, isMatch) {
        if (isMatch) {
          // console.log('isMatch inside loginUser');
          util.createSession(req, res, user);

        } else {
          // console.log('no match inside loginUser');
          res.redirect('/login');
        }
      });
    }
  });
};


exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}).exec((err, user) => {
    if (!user) {
      // console.log('in user not found in signUpUser');
      var newUser = new User({  //
        username: username,
        password: password
      });
      // console.log('newUser is created in signup user');
      // console.log('this is user in app: ', newUser);
      newUser.save(function(err, newUser) {
        if (err) {
          console.log('newUser not saved');
        } else {
          // console.log('Im in the app then');
          util.createSession(req, res, newUser);
        }
      });
      //create new usr
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });
};
//   new User({ username: username })
//     .fetch()
//     .then(function(user) {
//       if (!user) {
//         res.redirect('/login');
//       } else {
//         user.comparePassword(password, function(match) {
//           if (match) {
//             util.createSession(req, res, user);
//           } else {
//             res.redirect('/login');
//           }
//         });
//       }
//     });
// };

//   new User({ username: username }) //replace with mongoose syntax
//     .fetch()
//     .then(function(user) {
//       if (!user) {
//         var newUser = new User({  //
//           username: username,
//           password: password
//         });
//         newUser.save()
//           .then(function(newUser) {
//             // Users.add(newUser);
//             util.createSession(req, res, newUser);
//           });
//       } else {
//         console.log('Account already exists');
//         res.redirect('/signup');
//       }
//     });
// };
//link.visits = link.visits + 1;
exports.navToLink = function(req, res) {
  console.log('this is request.param', req.params);
  Link.findOne({ code: req.params[0] }).then((link) => {
    console.log('this is link in nav:', link);
    if (!link) {
      console.log('inside no link found');
      res.redirect('/');
    } else {
      console.log('inside link found');
      link.set({ visits: link.get('visits') + 1 })
        .save()
        .then(function() {
          console.log('inside then');
          url = link.get('url');
          console.log('this is link in url', url);
          return res.redirect(link.get('url'));
        });
    }
  });
};