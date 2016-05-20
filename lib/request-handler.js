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
  Link.find((err, links) => {
    console.log('this is links in fetchLinks find:', links);
    res.status(200).send(links);
  });
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
      res.status(200).send(link);
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
  
  var password = req.body.password;

  User.findOne({ 'username': username}).exec((err, user) => {
    if (!user) {
      res.redirect('/login');
    } else {
      bcrypt.compare(password, user.password, function(err, isMatch) {
        if (isMatch) {
          util.createSession(req, res, user);

        } else {
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
      var newUser = new User({
        username: username,
        password: password
      });
      newUser.save(function(err, newUser) {
        if (err) {
          console.log('newUser not saved');
        } else {
          util.createSession(req, res, newUser);
        }
      });
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {
  console.log('this is request.params', req.params);
  Link.findOne({ code: req.params[0] }).exec((err, link) => {
    if (!link) {
      res.redirect('/');
    } else {
      link.set({ visits: link.get('visits') + 1 })
        .save(function(err) {
          url = link.get('url');
          return res.redirect(link.get('url'));
        });
    }
  });
};