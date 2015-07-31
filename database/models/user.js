'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mailadress: {
        type: String,
        required: false
    },
    altMailadresses: {
        type: Array,
        required: false,
    }
});

UserSchema.pre('save', function(callback) {
    var user = this;
    if (!user.isModified('password')) return callback();
    
    bcrypt.genSalt(5, function(err, salt) {
        if (err) return callback(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return callback(err);
            user.password = hash;
            callback();
        });
    });
});

UserSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.methods.updatePassword = function(oldPassword, newPassword, cb) {
    var user = this;
    bcrypt.compare(oldPassword, user.password, function(err, isMatch) {
        if (err) return cb(err);
        if(isMatch) {
            user.password = newPassword;
            cb(null, true);
        } else {
            cb(new Error("Old password does not match"));
        }
    });
};

module.exports = mongoose.model('User', UserSchema);