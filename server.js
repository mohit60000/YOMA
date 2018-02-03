var express = require('express');

var app = express();
app.get('/', function(req, res) {
  res.send('Hello from Florida Gators!!! \n');
});

require('./pursuit-of-happiness-route')(app);
app.listen(4000);

console.log('Listening on port 4000...');

// app.get('/googlevision', function(req, res) {
//   res.send('Return reply from Google Vision Endpoint');
// });

// app.get('/mongo', function(req, res) {
//   res.send('Return reply from mongo endpoint');
// });

// app.get('/test', function(req, res) {
//   res.send('This is for testing purpose!');
// });