
var userID, firstName, lastName, emailID, address,password;
class User{
    constructor(userID,firstName,lastName,emailID,address,password){
        this.userID = userID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailID = emailID;
        this.address = address;
        this.password = password;
    }

get getUserID(){
    return this.userID;
}

set setUserID(value){
    this.userID = value;
}

get getFirstName(){
    return this.firstName;
}

set setFirstName(value){
    this.firstName = value;
}

get getLastName(){
    return this.lastName;
}

set setLastName(value){
    this.lastName = value;
}

get getEmailID(){
    return this.emailID;
}

set setEmailID(value){
    this.emailID = value;
}

get getAddress(){
    return this.address;
}

set setAddress(value){
    this.address = value;
}

get getPassword(){
    return this.password;
}

set setPassword(value){
    this.password = value;
}
}

 module.exports = {
     User: User
 }
