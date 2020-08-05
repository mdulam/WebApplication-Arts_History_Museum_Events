var User = require('../models/User.model');
var userModel = require('./../models/User');

/**
 * executes the query to get the user details by using the userID.
 * @function
 * @param {string} userID - List of required fields.
 */
var getUser = function (userID) {
    return User.findOne({ "userID": userID }).exec().then((data) => {
        return new userModel.User(data.userID, data.firstName, data.lastName, data.emailID, data.address, data.password);
    })

};

/**
 * executes the query to validate the user details by using the userID and password.
 * @function
 * @param {string} userName - List of required fields.
 * @param {string} password - List of required fields.
 */
var findUser = function (userName, password) {
    return User.findOne({ userID: userName, password: password }).exec().then((data) => {
        return new userModel.User(data.userID, data.firstName, data.lastName, data.emailID, data.address, data.password);

    })
};

/**
 * executes the query to find the user details by using the userID and email.
 * @function
 * @param {string} userID - List of required fields.
 * @param {string} emailID - List of required fields.
 */
var findUserByEmail = function (userID, emailID) {
    return User.findOne({ userID: userID, emailID: emailID }).exec().then((data) => {
        if (data) {
            return new userModel.User(data.userID, data.firstName, data.lastName, data.emailID, data.address, data.password);
        }
        else {
            return null;
        }

    })
};

/**
 * returns the query to get the salt field for a user from the database.
 * @function
 * @param {string} userID - List of required fields.
 */
var getUserSalt = function (userID) {
    return User.findOne({ userID: userID }, { _id: 0, salt: 1 });
}

/**
 * exectues the query to add a new user to the database.
 * @function
 * @param {string} userID - List of required fields.
 * @param {string} firstName - List of required fields.
 * @param {string} lastName - List of required fields.
 * @param {string} emailID - List of required fields.
 * @param {string} address - List of required fields.
 * @param {string} hashedPassword - List of required fields.
 * @param {string} salt - List of required fields.
 */
var addUser = function (userID, firstName, lastName, emailID, address, hashedPassword, salt) {
    return new User({ userID: userID, firstName: firstName, lastName: lastName, emailID: emailID, address: address, password: hashedPassword, salt: salt }).save().then((inserted) => {
        return inserted;
    })


}

module.exports.getUser = getUser;
module.exports.findUser = findUser;
module.exports.getUserSalt = getUserSalt;
module.exports.addUser = addUser;
module.exports.findUserByEmail = findUserByEmail;
