var express = require('express');
var logger = require('morgan');
var db = require(__dirname + '/db/index');



var app = express();

app.use(logger('dev'));

app.use('/', express.static('client'));
app.use('/addons', express.static('client/models/p5/'));


app.get('/getUsers', function(req, res) {
	db.getUsers()
		.then(function(result) {
			res.send(result);
		})
		.catch(function(error) {
			res.send('Error getting users.');
		});
});

app.get('/login', function(req, res) {
  body = {
    username: 'luig0',
    password: 'pass1234'
  };

  db.findUser(body)
    .then(function(result) {
      if(result.length > 0) {
        return result[0]; // if multiple entries exist for username, use the first. this can only happen by manual entries
      } else {
        res.send('User not found');
      }
    })
    .catch(function(err) {
      res.send(err);
    })
    .then(function(user) {
      // call a function from db that checks password
      db.isCorrectPassword(body)
        .then(function(isMatch) {
          if(isMatch) {
            res.send('password is correct');
          } else {
            res.send('password is incorrect');
          }
        });
    });
});

app.get('/addUser', function(req, res) {
  // var user = {
  //   username: 'longhorns',
  //   password: 'hashme',
  //   first_name: 'go horns',
  //   last_name: 'beat OU'
  // };

  var user = {
    username: 'luig0',
    password: 'pass1234',
    first_name: 'luig0_first',
    last_name: 'luig0_last'
  };

  db.findUser(user)
    .then(function(result) {
      if(result.length > 0) {
        res.send('User already exists in db');
      } else {
        db.addUser(user);
        res.send('User added');
      }
    })
});

app.get('/profile', function(req, res) {
  res.send('Welcome to the profile endpoint');
});

module.exports = app;