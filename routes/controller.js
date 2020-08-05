var express = require('express');
var router = express.Router();
var connectionDB = require('./../utilities/connectionDB');

/**
 * renders index page when the request type is get
 * @function
 */
router.get(['/index', '/'], function (req, res) {
  res.render('index', { session: req.session.userSession });
});

/**
  * renders the about page when the request type is get
  * @function
 */
router.get('/about', function (req, res) {
  res.render('about', { session: req.session.userSession });
});

/**
  * renders the contact us page when the request type is get
  * @function
 */
router.get('/contact', function (req, res) {
  res.render('contact', { session: req.session.userSession });
});

/**
  * renders the new connection page when the request type is get
  * enables user to enter details for the new connection
  * @function
 */
router.get('/newConnection', function (req, res) {
  if (req.session.userSession) {
    res.render('newConnection', { session: req.session.userSession, errors: null });
  }
  else {
    res.render('login', { session: req.session.userSession, errors: null })
  }
});

/**
  * gets the connection details from the database from the connection Id query param
  * if any error redirecrs to the connections page
  * @function
 */
router.get('/connection', function (req, res) {
  if ((Object.keys(req.query)).length != 0) {
    if (req.query.id != null && req.query.id != undefined && /^\d+$/.test(req.query.id)) {
      connectionDB.getConnection(req.query.id).then((data) => {
        if (!data) { res.redirect('connections'); }
        else { res.render('connection', { connectionDetails: data, session: req.session.userSession }); }
      });
    }
    else {
      res.redirect('connections');

    }
  }
  else {
    res.redirect('connections');
  }
});

/**
  * gets the connection details from the database from the connection Id query param
  * if any error redirecrs to the connections page
  * @function
 */
router.post('/connection', function (req, res) {
  if ((Object.keys(req.query)).length != 0) {
    if (req.query.id != null && req.query.id != undefined && /^\d+$/.test(req.query.id)) {
      connectionDB.getConnection(req.query.id).then((data) => {
        if (!data) { res.redirect('connections'); }
        else { res.render('connection', { connectionDetails: data, session: req.session.userSession }); }
      });
    }
    else {
      res.redirect('connections');

    }
  }
  else {
    res.redirect('connections');
  }
});

/**
  * gets all the connection details from the database 
  * @function
 */
router.get('/connections', function (req, res) {
  connectionDB.getConnections().then((data) => {
    connectionDB.getTopics().then((topics) => {
      res.render('connections', { myConnections: data, myTopics: topics, session: req.session.userSession });
    });
  })

});

module.exports = router;
