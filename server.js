var express = require('express');
mongoose = require('mongoose'),
fs = require('fs');

var mongoUri = 'mongodb://omi23.vaidya:Omkar23..@ds217898.mlab.com:17898/pofh';
mongoose.connect(mongoUri);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + mongoUri);
});


var app = express();
app.get('/', function(req, res) {
  res.send('Hello from Florida Gators!!! \n');
});

require('./api/models/User');
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