var app = require('./router.js');

const LISTEN_PORT = process.env.PORT || 3000;

app.listen(LISTEN_PORT, function() {
  console.log('Scream Machine server is listening on port ' + LISTEN_PORT);
});
