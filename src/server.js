var express = require("express"),
  app = express(),
  port = 3333, //process.env.PORT || 3333,
  //Task = require('./api/models/todoListModel'), //created model loading here
  bodyParser = require("body-parser");

// app.listen(port);

// postgres access here
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/Tododb');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require("./api/routes/cgenRoutes"); //importing route
routes(app); //register the route

app.listen(port);

console.log("todo list RESTful API server started on: " + port);