var mongoose = require('mongoose');

var connectionSchema = new mongoose.Schema({
connectionID: {type:String, required:true},
connectionName: {type:String, required:true},
connectionTopic: {type:String, required:true},
connectionDetail: {type:String, required:true},
connectionDuration: {type:String, required:true},
connectionTimings: {type:String, required:true},
connectionHostedBy: {type:String, required:true},
userID: {type:String, required:true}
});

module.exports = mongoose.model('connection', connectionSchema);

