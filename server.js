var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;

var routes = require('./apiRoutes/routes'); //importing route
routes(app);

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);