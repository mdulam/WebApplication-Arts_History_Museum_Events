var Userprofile = require('./../models/Userprofile.model.js');
var Connection = require('./../models/Connection.model.js');

/**
 * returns the query to get the user connections of a user by using the userID.
 * @function
 * @param {string} userID - List of required fields.
 */
var getUserProfile = function (userID) {
    return Userprofile.findOne({ "userID": userID }, { "userConnections": 1, _id: 0 }).exec().then((data) => {
        return data;
    });
}

/**
* returns the query to add the rsvp for a connection.
* @function
* @param {string} connectionID - List of required fields.
* @param {string} connectionName - List of required fields.
* @param {string} connectionTopic - List of required fields.
* @param {string} rsvp - List of required fields.
* @param {string} userID - List of required fields.
*/
var addRSVP = function (connectionID, connectionName, connectionTopic, rsvp, userID) {
    return Userprofile.updateOne({ "userID": userID, "userConnections.connectionID": { $ne: connectionID } }, { $push: { userConnections: { "connectionID": connectionID, "connectionName": connectionName, "connectionTopic": connectionTopic, "rsvp": rsvp } } })
        .exec().then((data) => {
            return data;
        }).catch((error) => {
            console.log(error);
        });
};

/**
* returns the query to update the rsvp for a connection.
* @function
* @param {string} userID - List of required fields.
* @param {string} connectionID - List of required fields.
* @param {string} rsvp - List of required fields.
*/
var updateRSVP = function (connectionID, rsvp, userID) {
    return Userprofile.updateOne({ "userID": userID, "userConnections.connectionID": connectionID }, { $set: { "userConnections.$.rsvp": rsvp } })
        .exec().then((data) => {
            return data;
        });
};

/**
* returns the query to delete the rsvp for a connection.
* @function
* @param {string} userID - List of required fields.
* @param {string} connectionID - List of required fields.
*/
var deleteRSVP = function (userID, connectionID) {
    return Userprofile.updateOne({ "userID": userID }, { $pull: { "userConnections": { connectionID: connectionID } } })
        .exec().then((data) => {
            return data;
        });
};

/**
* returns the query to save the connection in the user profile and also updates the the rsvp for a connection as yes.
* @function
* @param {object} data - List of required fields.
* @param {string} userID - List of required fields.
*/
var addConnection = function (data, userID) {

    return Connection.findOneAndUpdate(
        { "connectionName": data.connectionName, "connectionTopic": data.connectionTopic },
        {
            "connectionID": data.connectionID, "connectionName": data.connectionName, "connectionTopic": data.connectionTopic, "connectionDetail": data.connectionDetail,
            "connectionDuration": data.connectionDuration,
            "connectionTimings": data.connectionTimings,
            "connectionHostedBy": data.connectionHostedBy,
            "userID": userID
        }, { upsert: true, new: true, runValidators: true }).exec().then((result) => {

            return Userprofile.findOne({ "userID": userID }).exec().then((datares) => {
                if (datares) {
                    return Userprofile.updateOne({ "userID": userID, "userConnections.connectionID": { $ne: data.connectionID } },
                        { $push: { userConnections: { "connectionID": data.connectionID, "connectionName": data.connectionName, "connectionTopic": data.connectionTopic, "rsvp": "yes" } } }).exec().then((res) => {
                            return res;
                        });
                }
                else {

                    return Userprofile.findOneAndUpdate({ "userID": userID }, {
                        "userID": userID,
                        "userConnections": [{ "connectionID": data.connectionID, "connectionName": data.connectionName, "connectionTopic": data.connectionTopic, "rsvp": 'yes' }]
                    }, { upsert: true, new: true, runValidators: true }).exec().then((data) => {
                        return data;
                    })
                }
            })
        });
};


module.exports.getUserProfile = getUserProfile;
module.exports.addRSVP = addRSVP;
module.exports.updateRSVP = updateRSVP;
module.exports.deleteRSVP = deleteRSVP;
module.exports.addConnection = addConnection;
