var express = require('express');
var app = express();
app.set('view engine','ejs');
app.use('/assets',express.static('assets'));
var session = require('express-session');
app.use(session({secret: "meghana*50"}));

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/Events", { useNewUrlParser: true , useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error" , console.error.bind(console , "connection error"));

// if the database connection is open the app starts listening to the port number 3000 and imports all the route methods
db.once("open" , function(){
  var controller = require('./routes/controller');
  var userController = require('./routes/UserController');
  
  app.use('/',controller);
  app.use('/', userController);
  
  app.listen(3000, function(){
    console.log('Hey you are listening to port 3000')
  });
});



