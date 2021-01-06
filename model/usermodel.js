var mongoose = require('mongoose');
var bcrypt = require("bcrypt");
require('../db');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    type:{
        type: String,
        default: "Customer"
    },
    posts: {
        type: [String]
    }
});

//Hash password before save to the database
UserSchema.pre('save', function (next) {
    var newuser = this;
    bcrypt.hash(newuser.password, 10, (err, hash) => {
        if (!err) {
            console.log(hash);
            newuser.password = hash;
            next();
        }
        else {
            reject(new Error(json({ message: "Internal server error" })));
        }
    });

});

module.exports = mongoose.model("Users", UserSchema);
