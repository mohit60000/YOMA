var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;

require('./api/models/User');
require('./apiRoutes/routes')(app); //importing route

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);