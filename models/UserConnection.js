var connection, rsvp;
class Userconnection{
    constructor(connection, rsvp){
        this.connection = connection;
        this.rsvp = rsvp;
    }

get getConnection(){
    return this.connection;
}

set setConnection(value){
    this.connection = value;
}

get getRsvp(){
    return rsvp;
}

set setRsvp(value){
    this.rsvp = value;
}
}

 module.exports = {
     Userconnection: Userconnection
 }
