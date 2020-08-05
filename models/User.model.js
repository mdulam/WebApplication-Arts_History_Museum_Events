var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    userID: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    emailID: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true }
});

module.exports = mongoose.model('user', userSchema);

