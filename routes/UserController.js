var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var connection = require('../models/Connection.js');
var userConnection = require('../models/UserConnection.js');
var user = require('../models/User.js');
var connectionDB = require('../utilities/connectionDB.js');
var userProfileDB = require('../utilities/UserProfileDB.js');
var userDB = require('../utilities/UserDB.js');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var { check, validationResult } = require('express-validator');
var crypto = require('crypto');

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha2 = function (password, salt) {
  var hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  var value = hash.digest('hex');
  return value;
}

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function (length) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};

/**
 * routes to signUp page
 * @function
 */
router.get('/signup', function (req, res) {
  res.render('signUp', {  errors: null });
});

/**
 * route for signUp page when request type is post. 
 * Adds an user to the database
 * @function
 */
router.post('/signUp', urlencodedParser,
  [
    check('userID').trim().not().isEmpty().withMessage('User ID should not be empty')
      .isLength({ min: 5 }).withMessage('User ID must be 5 characters long'),
    check('emailID').trim().isEmail().withMessage('Invalid email address'),
    check('address').trim().not().isEmpty().withMessage('Address should not be empty').isLength({ min: 10 }).withMessage('Address should be atleast 10 characters long')
      ,
    check('password').trim().not().isEmpty().withMessage('Password should not be empty')
      .isLength({ min: 5 }),
    check('repassword').trim ().not().isEmpty().withMessage('Please re-enter password').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }      
      return true;
    })
    ],
  function (req, res) {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      var errorsArray = errors.array();
      return res.render('signUp', {errors: errorsArray });
    }
    var userID = req.body.userID;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var emailID = req.body.emailID;
    var address = req.body.address;
    var password = req.body.password;
    var repassword = req.body.repassword;
    var salt = genRandomString(16);
    var hashedPassword = sha2(password, salt);

    
    userDB.findUserByEmail(userID, emailID).then((value) => {
      if (!value) {
        
        userDB.addUser(userID, firstName, lastName, emailID, address, hashedPassword, salt).then((inserted) => {
          if (inserted) {
            res.redirect('/login?signup=true');
          }
        })
      }
      else {
        var invalidMsg = [{
          "location": "body",
          "msg": "Email ID or Username already exists",
          "param": "emailID"
        }]
        return res.render('signUp', { session: undefined, errors: invalidMsg });
      }
    })

  });

/**
 * routes to login page
 * @function
 */
router.get('/login', function (req, res) {

  if (req.session.userSession) {
    res.redirect('savedConnections');
  }
  
    if (req.query.signup) {
      var signupmsg = [{
        "location": "body",
        "msg": "SignUp successfull. Please Login with userID as username and password to continue",
        "param": "heading"
      }]
      res.render('login', { session: undefined, errors: signupmsg });
    }
    else{
      res.render('login', { session: undefined, errors: null });

    }

});

/**
  * assign user session and enables user to login to the application
  * checks whether the entered username and password is valid or not.
  * If valid redirects to saved connections page or else displays an error message
  * @function
 */
router.post('/login', urlencodedParser,
  [
    check('username').trim().not().isEmpty().withMessage('User Name should not be empty')
      .isLength({ min: 5 }).withMessage('User Name must be 5 characters long'),
    check('password').trim().not().isEmpty().withMessage('Password should not be empty')
      .isLength({ min: 5 })],
  function (req, res) {

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      var errorsArray = errors.array();
      return res.render('login', { session: undefined, errors: errorsArray });
    }
    var userID = req.body.username;
    var pswrd = req.body.password;

    userDB.getUserSalt(userID).exec().then((salt) => {
      if(salt){
        var hashedPswrd = sha2(pswrd, salt.salt);
        userDB.findUser(userID, hashedPswrd).then((value) => {
          if (value) {
            req.session.userSession = value;
            res.redirect('savedConnections');
          }
          else {
            var invalidMsg = [{
              "location": "body",
              "msg": "Invalid username or password",
              "param": "password"
            }]
            return res.render('login', { session: undefined, errors: invalidMsg });
          }
        })
      }
      else{
        var invalidMsg = [{
          "location": "body",
          "msg": "Invalid username or password",
          "param": "password"
        }]
        return res.render('login', { session: undefined, errors: invalidMsg });
      }
     
    })
  });

  /**
  * logout's the user session
  * redirects to login page when request type is GET
  * @function
 */
router.get('/logout', function (req, res) {
  req.session.destroy();
  res.render('index', { session: undefined });
});

/**
  * gets all the saved connections for the logged In user
  * @function
 */
router.get('/savedConnections', function (req, res) {
  if (req.session.userSession != undefined) {
    var userSession = req.session.userSession;
    userProfileDB.getUserProfile(userSession.userID).then((data) => {
      if (data) {
        res.render('savedConnections', { userConnections: data.userConnections, session: userSession });
      }
      else {
        res.render('savedConnections', { userConnections: [], session: userSession });
      }
    });
  }
  else {
    res.redirect('/login')
  }
});

/**
  * adds the new connection details to the database and redirects to saved connection page once the connection is added
  * if any error render the new connection page and displays errors
  * @function
 */
router.post('/newConnection', urlencodedParser,
  [
    check('connectionName').trim().not().isEmpty().withMessage('connectionName should not be empty').isLength({ min: 5 }).withMessage('connectionName should be atleast 5 characters long')
      ,
    check('connectionTopic').trim().not().isEmpty().withMessage('connectionTopic should not be empty').isLength({ min: 5 }).withMessage('connectionTopic should be atleast 5 characters long')
      
    ,
    check('details').trim().not().isEmpty().withMessage('details should not be empty').isLength({ min: 10 }).withMessage('details should be atleast 10 characters long')
      ,
    check('connectionDurationEnd').trim().not().isEmpty().withMessage('details should not be empty')
      .custom((value, { req }) => {

        if (value <= req.body.connectionDuration) {
          throw new Error('end date should be after start date');
        }
        return true;
      }),
    check('connectionDuration').trim().not().isEmpty().withMessage('date time should not be empty')
      .custom((value, { req }) => {

        var currentDateTime = new Date().toJSON().split('T')[0];

        if (value <= currentDateTime) {
          throw new Error('start date should be after current date');
        }
        return true;
      }),
    check('connectionTimings').trim().not().isEmpty().withMessage('Timings should not be empty')
  ],
  function (req, res) {

    if (!req.session.userSession) {
      res.redirect('login');
    }
    else {
      var errors = validationResult(req);
      if (!errors.isEmpty()) {
        var errorsArray = errors.array();
        return res.render('newConnection', { session: req.session.userSession, errors: errorsArray });
      }
      if (req.body) {
        var conName = req.body.connectionName;
        var conTopic = req.body.connectionTopic;
        var conDuration = req.body.connectionDuration;
        var conDurationEnd = req.body.connectionDurationEnd;
        var conTimings = req.body.connectionTimings;
        var details = req.body.details;

        var duration = conDuration + " - " + conDurationEnd;
        var hostedBy = req.session.userSession.firstName + " " + req.session.userSession.lastName;

        connectionDB.getConnectionByNameAndTopic(conName, conTopic).then((present) => {
          if (present) {
            var conObj = new connection.Connection(present.connectionID, conName, conTopic, details, duration, conTimings, hostedBy);
            userProfileDB.addConnection(conObj, req.session.userSession.userID).then((response) => {
              res.redirect('savedConnections');
            })
          }
          else {
            connectionDB.getConnectionID().then((data) => {
              var id;
              if(data){
                id = parseInt(data) + 1;
              }
              else{
              id =  1;
              }
              
              var conObj = new connection.Connection(id, conName, conTopic, details, duration, conTimings, hostedBy)
              userProfileDB.addConnection(conObj, req.session.userSession.userID).then((response) => {
                res.redirect('savedConnections');
              })
            })
          }
        })


      }
      else {
        res.redirect('error404');
      }
    }

  });

/**
  * updates the connection response, delete the saved connection for an user and adds the connection
  * @function
 */
router.post('/savedConnections', urlencodedParser, function (req, res) {
  var userSession = req.session.userSession;
  var connectionId = req.query.id;

  if (!connectionId) {
    res.redirect('savedConnections');
  } else {
    if(/^\d+$/.test(connectionId)){
      var response = req.body.going;
      if (response) {
        connectionDB.getConnection(connectionId).then((data) => {

          if(data){
            userProfileDB.updateRSVP(connectionId, response, userSession.userID).then((resp) => {
              if (resp.n == 0) {
                userProfileDB.addRSVP(connectionId, data.connectionName, data.connectionTopic, response, userSession.userID).then((respon) => {
                  return res.redirect('savedConnections');
                })
              }
              else {
                return res.redirect('savedConnections');
              }
            })
          }
          else{
            res.redirect('connections');
          }
         
        });
      }
      else {
        userProfileDB.deleteRSVP(userSession.userID, connectionId).then((response) => {
          return res.redirect('savedConnections');
        })
      }
    }
    else{
      res.redirect('connections');
    }
    
  }
});

/**
  * error page for malfunctioned url endpoint
  * @function
 */
router.get('/*', function (request, response) {
  response.render('error404');
});

module.exports = router;
