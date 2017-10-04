// FYI
// npm start script does not show server-side console logs
// To circumvent this during development, I ran two terminal sessions:
// 1) webpack -d --watch
// 2) nodemon server/server.js
// - package.json already points to server.js, so you can actually
//   just run "nodemon"

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var db = require(__dirname + '/db/index');

const cookieParser = require('cookie-parser');
const session = require('express-session');


var app = express();

app.use(logger('dev'));
app.use(bodyParser());

app.use(cookieParser());
app.use(session({secret: 'screaming'}));

app.use('/', express.static('client'));

/**************************************************
 *
 *  GET Requests:
 *    Many of these are here for development
 *    purposes; helps the team to see what are in
 *    various tables without having to install
 *    a local copy of the Postgres DB.
 *
 **************************************************/


/*
Special endpoint whose sole purpose is to return the status of a user's
session in the form of a response obj.
This is used on the front end in order to determine login status and to
update state accordingly
*/
app.get('/getStatus', function(req, res) {
	// console.log('This is the current req session ',req.session.isLoggedIn);
	let sessionObj = {
		isLoggedIn : req.session.isLoggedIn || false,
		username: req.session.username || undefined
	}
	res.send(sessionObj);
});

app.get('/getUsers', function(req, res) {
  db.getUsers()
    .then(function(result) {
      res.send(result);
    })
    .catch(function(error) {
      res.send('Error getting users.');
    });
});

app.get('/getScreams', function(req, res) {
  db.getScreams()
    .then(function(result) {
      res.send(result);
    });
});

app.get('/getScream', function(req, res) {
  db.getScream(req.session.username)
    .then(function(result) {
      res.send(result);
    })
});

app.get('/getForms', function(req, res) {
  db.getForms()
    .then(function(result) {
      res.send(result);
    })
});

app.get('/getForm', function(req, res) {
  db.getForm(req.session.username)
    .then(function(result) {
      res.send(result);
    })
});

app.get('/getAverages', function(req, res) {
  db.getAverages()
    .then(function(result) {
      res.send(result);
    })
});

app.get('/getAverage', function(req, res) {
  // need to changed to use sessions

  db.getAverage(req.session.username)
    .then(function(result) {
      res.send(result);
    })
});

app.get('/getHighScores', function(req, res) {
  // need to call function that gets user data and get user high scores

  db.getHighScores()
    .then(function(result) {
      res.send(result);
    })
});

/**************************************************
 *
 *  POST Requests:
 *    These endpoints are used by front end to add
 *    records to Postgres
 *
 **************************************************/

app.post('/login', function(req, res) {

  db.findUser(req.body)
    .then(function(result) {
      if(result.length > 0) {
        return result[0]; // if multiple entries exist for [ username ], use the first. this can only happen by manual entries
      } else {
        res.send('User not found');
      }
    })
    .then(function(user) {
      // call a function from db that checks password
      db.isCorrectPassword(req.body)
        .then(function(isMatch) {
          if(isMatch) {
						req.session.isLoggedIn = true;
						req.session.username = req.body.username;
						res.send('Password is correct; session established');
          } else {
            req.session.destroy();
						res.send('password is incorrect');
          }
        });
    })
		.then(function() {
			db.getUserData(req.body)
			.then(function(userObj){
				return db.getUserHighScore(userObj)
					.then(([{score}]) => {
						userObj.score = score
						res.send(userObj)
					})
			})
		})
    .catch(function(err) {
      res.send(err);
    });
});


// Endpoint /addUser is used for signup
app.post('/addUser', function(req, res) {
  console.log('/addUser, req.body: ', req.body);

  var user = req.body;

  db.findUser(user)
    .then(function(result) {
      if(result.length > 0) {
        res.send('User already exists in db');
      } else {
        db.addUser(user)
          .then(function(result) {
            // res.cookie('username', user.username);
            // res.cookie('isLoggedIn', true);
            //Adding session method for testing
            req.session.username = user.username;
            req.session.isLoggedIn = true;
            res.send('User added');
          })
          .catch(function (error) {
            res.send('addUser catch: ', error);
          });
      }
    })
    .catch(function(error) {
      res.send('findUser catch: ' + error);
    });
});

app.post('/addScream', function(req, res) {
  // auth management is being handled in front end

  var screamData = req.body.params;
  console.log('router.js, req.body: ', req.body.params);

  db.addScream(screamData)
    .then(function(result) {
      console.log('addScream method success');
      res.send('Successfully added scream data');
    })
    .catch(function(error) {
      console.log('addScream method failure');
      res.send('Failed to add scream');
    });
});

app.post('/addForm', function(req, res) {

  var formData = req.body.params;
  console.log(formData);
  db.addForm(formData)
    .then(function(result) {
      res.send('Successfully add form data');
    })
    .catch(function(error) {
      console.log('add Form method failed');
      res.send('failed to add form');
    });
});

app.post('/addAverages', function(req, res) {
  // post averages
  db.addAverages(req.body.params)
    .then(function(result) {
      res.send(result);
    })
});

// Test Route
app.post('/getUserHighScore', function(req, res) {
	db.getUserHighScore({username: "pete", id: 2})
	.then(function(data) {
		res.send(data);
	})
});

module.exports = app;
