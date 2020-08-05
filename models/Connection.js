
var connectionID, connectionName, connectionTopic, connectionDetail, connectionDuration, connectionTimings, connectionHostedBy;
class Connection{
    constructor(connectionID,connectionName,connectionTopic,connectionDetail,connectionDuration,connectionTimings,connectionHostedBy){
        this.connectionID = connectionID;
        this.connectionName = connectionName;
        this.connectionTopic = connectionTopic;
        this.connectionDetail = connectionDetail;
        this.connectionDuration = connectionDuration;
        this.connectionTimings = connectionTimings;
        this.connectionHostedBy = connectionHostedBy;
    }

get getConnectionId(){
    return this.connectionID;
}

set setConnectionId(value){
    this.connectionID = value;
}

get getConnectionName(){
    return this.connectionName;
}

set setConnectionName(value){
    this.connectionName = value;
}

get getConnectionTopic(){
    return this.connectionTopic;
}

set setConnectionTopic(value){
    this.connectionTopic = value;
}

get getConnectionDetails(){
    return this.connectionDetail;
}

set setConnectionDetails(value){
    this.connectionDetail = value;
}

get getConnectionDuration(){
    return this.connectionDuration;
}

set setConnectionDuration(value){
    this.connectionDuration = value;
}

get getConnectionTimings(){
    return this.connectionTimings;
}

set setConnectionTimings(value){
    this.connectionTimings = value;
}

get getConnectionHostedBy(){
    return this.connectionHostedBy;
}

set setConnectionHostedBy(value){
    this.connectionHostedBy = value;
}
}

 module.exports = {
     Connection: Connection
 }
