var mongoose = require('mongoose');

var userProfileSchema = new mongoose.Schema({
userID: {type:String, required: true},
userConnections: [{connectionID:String, connectionName:String, connectionTopic:String, rsvp:String }]
});

module.exports = mongoose.model('userprofile', userProfileSchema);

