const { Pool } = require('pg');

var config = {
  host: 'localhost',
  user: 'postgres',
  password: 'admin',
  database: 'scream'
};

const pool = new Pool(config);

module.exports = {
  getUsers: function () {
    return pool.query("select * from users")
      .then(function(result) {
        return result.rows;
      });
  },

  signup: function(person) {
    /* person should be an array of the following structure:
     *  [
     *    'username',
     *    'password',
     *    'first_name',
     *    'last_name'
     *  ]
     */
    const query = {
      text: 'INSERT INTO users(username, password, first_name, last_name) VALUES($1, $2, $3, $4)',
      values: person,
    }

    return pool.query(query)
      .then(function() {
        return '1 record successfully added.';
      })
      .catch(function() {
        return 'Failed to add record.';
      });
  },

  loggerTest: function(req, res, next) {
    console.log('hello world from my db indexjs loggerTest middleware!');
    next();
  }
}