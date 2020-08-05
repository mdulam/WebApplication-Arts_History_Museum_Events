var connection = require('../models/Connection');
var connectionModel = require('../models/Connection.model');

/**
 * exectues the query to get the connection details matches with connection ID.
 * @function
 * @param {string} connectionID - List of required fields.
 */
var getConnection = function (connectionID) {
  return connectionModel.findOne({ connectionID: connectionID }).exec().then((data) => {
    if(data){
      return new connection.Connection(data.connectionID, data.connectionName, data.connectionTopic, data.connectionDetail, data.connectionDuration, data.connectionTimings, data.connectionHostedBy);
    }
    else{
      return null;
    }
  }).catch((err) => {
    console.log(err);

  });
};

/**
 * exectues the query to check whether the entered connection name and topic is present in a connection or not.
 * @function
 * @param {string} conName - List of required fields.
 * @param {string} conTopic - List of required fields.
 */
var getConnectionByNameAndTopic=function (conName, conTopic){
  return connectionModel.findOne({ connectionName: conName, connectionTopic: conTopic}).exec().then((data) => {
    if(data){
      return new connection.Connection(data.connectionID, data.connectionName, data.connectionTopic, data.connectionDetail, data.connectionDuration, data.connectionTimings, data.connectionHostedBy);

    }
    else{
      return null;
    }
  }).catch((err) => {
    console.log(err);

  }); 
}

/**
 * exectues the query to get the connection details.
 * @function
 */
var getConnections = function () {
  var connections = [];
  return connectionModel.find({}).exec().then((data) => {
    data.forEach(function (data) {
      connections.push(new connection.Connection(data.connectionID, data.connectionName, data.connectionTopic, data.connectionDetail, data.connectionDuration, data.connectionTimings, data.connectionHostedBy));
    });
    return connections;
  })

};

/**
 * exectues the query to get the connection Topics.
 * @function
 */
var getTopics = function () {
  var topicList = [];
  return connectionModel.find({}, { connectionTopic: 1, _id: 0 }).exec().then((data) => {
    data.forEach(function (item) {
      if (!topicList.includes(item.connectionTopic)) {
        topicList.push(item.connectionTopic);
      }
    });
    return topicList;
  })
};

/**
 * exectues the query to get the Last connection details.
 * @function
 */
var getConnectionID = function () {
  return connectionModel.find({}, { connectionID: 1, _id: 0 }).sort({ connectionID: -1 }).limit(1).exec().then((data) => {
    return data[0].connectionID;
  });
}



module.exports.getConnections = getConnections;
module.exports.getConnection = getConnection;
module.exports.getTopics = getTopics;
module.exports.getConnectionID = getConnectionID;
module.exports.getConnectionByNameAndTopic=getConnectionByNameAndTopic;
