var express = require("express"),
  app = express(),
  port = 3333, //process.env.PORT || 3333,
  //Task = require('./api/models/todoListModel'), //created model loading here
  bodyParser = require("body-parser");

// app.listen(port);

// postgres access here
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/Tododb');

// the following header mod fixes a CORS problem between the UI and API
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require("./api/routes/cgenRoutes"); //importing route
routes(app); //register the route

app.listen(port);

console.log("todo list RESTful API server started on: " + port);