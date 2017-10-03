
/***************************************************
 * REFERENCE: ScreamMachine/server/db/pgschema.sql *
 ***************************************************/

var bcrypt = require('bcrypt');
const saltRounds = 5;

const { Pool } = require('pg');

// [ config ] is a settings switcher for Postgres; we were at one
//    point running local and online copies of Postgres and needed
//    to be able to easily switch between them

var config = {
  heroku: {
    host: 'ec2-54-235-88-58.compute-1.amazonaws.com',
    user: 'lnhhqcwwfkgyqw',
    password: '0d85baa1e330fd21e90afe335cf0bd9a32bb117f6cb785914114c9848bf1cb74',
    database: 'd461kk2fe556bm',
    ssl: true
  }
};

// Use the following line to choose your Postgres config from above:

const pool = new Pool(config['heroku']);

// Following functions are mostly split by GETTERS and SETTERS
//  Exceptions are: [ findUser, isCorrectPassword ]
//  - Used in authentication
//
//  Getters are used to make database tables available to front end devs
//
//  Differences between plural and singular methods:
//  - getScreams gets everything from the [ screams ] table for all users
//  - getScream requires a user to be specified and only returns data for that user
//  - getForm(s), getAverage(s) follow the same convention

module.exports = {
  getUsers: function () {
    return pool.query("SELECT username, first_name, last_name FROM users")
      .then(function(result) {
        return result.rows;
      })
      .catch(function(err) {
        console.log('getUsers query fail');
        return err;
      });
  },

  getScreams: function() {
    return pool.query("select * from screams")
      .then(function(result) {
        return result.rows;
      })
      .catch(function(error) {
        console.log('getScreams query fail');
        return err;
      });
  },

  getScream: function(username){
    var query = 'SELECT * FROM screams WHERE user_id = (SELECT id FROM users WHERE username=$1)';
    return pool.query(query,[username])
      .then(function(result) {
        return result.rows;
      })
      .catch(function(error) {
        console.log('getScream query fail');
        return error;
      });
  },

  getForms: function() {
    return pool.query("SELECT * FROM form")
      .then(function(result) {
        return result.rows;
      })
      .catch(function(error) {
        console.log('getForms query fail');
        return error;
      });
  },

  getForm: function(username) {
    var query = 'SELECT * FROM forms WHERE user_id = (SELECT id FROM users WHERE username=$1)';
    return pool.query(query, [ username ])
      .then(function(result) {
        return result.rows;
      })
      .catch(function(error) {
        console.log('getForm query fail');
        return error;
      });
  },

  getAverages: function() {
    return pool.query("select * from averages")
      .then(function(result) {
        return result.rows;
      })
      .catch(function(error) {
        console.log('getAverages query fail');
        return error;
      });
  },

  getAverage: function(username) {
    var query = 'SELECT * FROM averages WHERE user_id = (SELECT id FROM users WHERE username=$1)';
    return pool.query(query,[username])
      .then(function(result) {
        return result.rows[0];
      })
      .catch(function(error) {
        console.log('getAverage query fail');
        return error;
      });
  },

  getHighScores: function() {
    //return top five scores from database with the users associated
    return pool.query("SELECT user_scores.score, users.username FROM user_scores INNER JOIN users ON user_scores.user_id = users.id ORDER BY user_scores.score DESC limit 5")
    .then(function(result){
      return result.rows;
    })
    .catch(function(err){
      console.log(err);
    });
  },

  getUserData: function(user) {
    return pool.query("SELECT * FROM users WHERE username = '" + user.username + "'")
    .then(function(result){
      return result.rows[0];
    })
    .catch(function(err){
      console.log(err);
    });
  },

  findUser: function(user) {
    return pool.query("SELECT username FROM users WHERE username = '" + user.username + "'")
      .then(function(result) {
        return result.rows;
      })
      .catch(function(err) {
        console.log('findUser query fail');
        return err;
      });
  },

  addUser: function(user) {
    /* user should be an object of the following structure:
     *  {
     *    username: 'username',
     *    password: 'password',
     *    first_name: 'first_name',
     *    last_name: 'last_name'
     *  }
     */

     return bcrypt.hash(user.password, saltRounds)
      .then(function(hash) {
        user.password = hash;

        // changed query from obj to string
        let query = 'INSERT INTO users(username, password, first_name, last_name) VALUES($1, $2, $3, $4)';

        return pool.query(query, [ user.username, user.password, user.first_name, user.last_name ])
          .then(function(result) {
            console.log('db.index.js, succcess: ', result.rows);
            return result.rows;
          })
          .catch(function(err) {
            console.log('db error: ', err);
            return err;
          });
      })
      .catch(function(err) {
        console.log('bcrypt hash error: ', err);
        return err;
      });
  },

  isCorrectPassword: function(user) {
    // Assumes that you first check if user exists before running this function

    // changed from string concat to $1 format
    let query = 'SELECT password FROM users WHERE username=$1';

    return pool.query(query, [ user.username ])
      .then(function(result) {
        return bcrypt.compare(user.password, result.rows[0].password)
          .then(function(isMatch) {
            return isMatch;
          });
      });
  },

  addScream: function(data) {
    // add a scream to database
    /* data should be an object of the following structure:
     *  {
     *    username: 'username',
     *    volume: 1.0000,
     *    lowFreq: 1.0000,
     *    midFreq: 1.0000,
     *    highFreq: 1.0000
     *  }
     */

    // changed query from obj to string
    let query = 'INSERT INTO screams (user_id, volume, lowFreq, midFreq, highFreq) VALUES ( (SELECT id FROM users WHERE username=$1), $2, $3, $4, $5);'

    return pool.query(query,[data.username, data.volume, data.lowFreq, data.midFreq, data.highFreq])
      .then(function(result) {
        console.log('addScream query success');
        return result;
      })
      .catch(function(error) {
        console.log('addScream query fail');
        return error;
      });
  },

  addForm: function(data) {
    /*
     *  data should be object of following structure:
     *  {
     *    username: 'username',
     *    stress_level: 0,
     *    stressors: 'stressors'
     *  }
     *
     */

     // Changed query from obj to string
     let query = 'INSERT INTO form (user_id, stress_level, stressors) VALUES ( (SELECT id FROM users WHERE username=$1), $2, $3);';

     return pool.query(query,[data.username, data.stress_level, data.stressors])
      .then(function(result) {
        return result;
      })
      .catch(function(error) {
        console.log('addForm query fail');
        return error;
      });
  },

  addAverages: function(data) {
    /*
     *  data should be object of following structure:
     *  {
     *    username: 'username',
     *    stress_level: 0,
     *    form_data: 'form_data'
     *  }
     *
     */
    console.log(data);
    // changed query from obj to string
    if (data.isFirst) {
      var query = 'INSERT INTO averages (user_id, stress_level, form_data) VALUES ( (SELECT id from users WHERE username=$3), $1, $2)';
    } else {
      var query = 'UPDATE averages SET stress_level = $1, form_data = $2 WHERE user_id = (SELECT id FROM users WHERE username=$3);'
    }
     return pool.query(query,[data.stress_level, data.form_data, data.username]);
  }
}
