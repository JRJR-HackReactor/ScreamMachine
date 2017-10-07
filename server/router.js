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

	if (req.session.username) {
		db.getUserData({username: req.session.username})
		.then(function(userObj){
			return db.getHighScore(userObj)
			.then((result) => {
				if (result.length > 0) {
					userObj.personalBest = result[0].score
				} else {
					userObj.personalBest = 1;
				}
				let sessionObj = {
					isLoggedIn : req.session.isLoggedIn || false,
					user: userObj
				}
				res.send(sessionObj);
			})
		})
	} else {
		let sessionObj = {
			isLoggedIn : false,
			user: null
		}
		res.send(sessionObj);
	}

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

  db.getHighScores()
    .then(function(result) {
      res.send(result);
    })
});

app.get('/logout', function(req, res) {
	req.session.destroy()
	res.send('Logged out');
})

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
          } else {
            req.session.destroy();
          }
        });
    })
		.then(function() {
			db.getUserData(req.body)
			.then(function(userObj){
				return db.getHighScore(userObj)
				.then((result) => {
					if (result.length > 0) {
						userObj.personalBest = result[0].score
					} else {
						userObj.personalBest = 1;
					}
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

  var user = req.body;

  db.findUser(user)
  .then(function(result) {
      if(result.length > 0) {
        res.send('User already exists in db');
      } else {
        db.addUser(user)
        .then(function(result) {
          req.session.username = user.username;
          req.session.isLoggedIn = true;
        })
				.then(function() {
					db.getUserData(user)
					.then(function(userObj){
						return db.getHighScore(userObj)
						.then((result) => {
							if (result.length > 0) {
								userObj.personalBest = result[0].score
							} else {
								userObj.personalBest = 1;
							}
							res.send(userObj)
						})
					})
				})
		    .catch(function(error) {
    			res.send('findUser catch: ' + error);
  			});
			}
		})
});

app.post('/addScream', function(req, res) {
  // auth management is being handled in front end

  var screamData = req.body.params;

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

//
app.post('/addScore', function(req, res) {
	db.addScore(req.body.user, req.body.score)
	.then(function(data) {
		res.status(201).send(data);
	})
});

module.exports = app;
