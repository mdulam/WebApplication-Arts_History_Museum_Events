var userconnection = require('./userConnection');
var connectionData = require('../utilities/connectionDB');
var connection = require('./Connection');

var userID, userConnections;

class UserProfile {
  constructor(userID, userConnections) {
    this.userID = userID;
    this.userConnections = userConnections;
  }

  get getUserID() {
    return this.userID
  }
  set setUserID(value) {
    this.userID = value;
  }

  get getUserConnections() {
    return this.userConnections;
  }
  set setUserConnections(list) {
    this.userConnections = list;
  }
}

module.exports = {
  UserProfile: UserProfile
}
