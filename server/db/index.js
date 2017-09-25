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

const pool = new Pool(config['aws']);

// the pool with emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
});

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

     return bcrypt.hash(user.password, saltRounds)
      .then(function(hash) {
        user.password = hash;

        let rayedUser = [ 
          user.username,
          user.password,
          user.first_name,
          user.last_name
        ];

        let query = {
          text: 'INSERT INTO users(username, password, first_name, last_name) VALUES($1, $2, $3, $4)',
          values: rayedUser
        };

        return pool.query(query)
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
        console.log('db error: ', err);
        return err;
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

  addScream: function(data) {
    // add a scream to database
    /* data should be an object of the following structure:
     *  { 
     *    username: 'username',
     *    volume: 1.0000,
     *    frequency: 1.0000,
     *    duration: 1.0000
     *  }
     */
    let query = {
      text: `INSERT INTO screams (user_id, volume, frequency, duration)
              VALUES (
                (SELECT id FROM users WHERE username='${data.username}'),
                ${data.volume},
                ${data.frequency},
                ${data.duration}
              );`
    };
    return pool.query(query)
      .then(function(result) {
        console.log('addScream query success');
        return result;
      })
      .catch(function(error) {
        console.log('addScream query fail');
        return error;
      });
  }
}

/*

*/