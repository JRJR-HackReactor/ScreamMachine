var bcrypt = require('bcrypt');
const saltRounds = 5;

const { Pool } = require('pg');

/******************** pick your config ***********************/
// Changed to toggle by object properties; toggle in row 21 new Pool(config[xxx])
var config = {
  aws: {
    host: 'localhost',
    user: 'screamer',
    password: '',
    database: 'scream'
  },
  jc_offline: {
    host: 'localhost',
    user: 'postgres',
    password: 'admin',
    database: 'scream'
  }
};

const pool = new Pool(config['jc_offline']);

module.exports = {
  getUsers: function () {
    return pool.query("select username, first_name, last_name from users")
      .then(function(result) {
        return result.rows;
      })
      .catch(function(err) {
        console.log('query fail');
        return err;
      });
  },

  findUser: function(user) {
    return pool.query("SELECT username FROM users WHERE username = '" + user.username + "'")
      .then(function(result) {
        return result.rows;
      })
      .catch(function(err) {
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

    bcrypt.hash(user.password, saltRounds, function(err, hash) {
      user.password = hash;

      rayedUser = [ user.username, user.password, user.first_name, user.last_name ];

      const query = {
        text: 'INSERT INTO users(username, password, first_name, last_name) VALUES($1, $2, $3, $4)',
        values: rayedUser,
      }

      return pool.query(query)
        .then(function(result) {
          console.log('succcess: ', result);
          return result;
        })
        .catch(function(err) {
          return err;
        });
    });

    
  },

  isCorrectPassword: function(user) {
    // Assumes that you first check if user exists before running this function
    
    return pool.query("SELECT password FROM users WHERE username = '" + user.username + "'")
      .then(function(result) {
        return bcrypt.compare(user.password, result.rows[0].password)
          .then(function(isMatch) {
            return isMatch;
          });
      });
  },

  loggerTest: function(req, res, next) {
    console.log('hello world from my db indexjs loggerTest middleware!');
    next();
  }
}