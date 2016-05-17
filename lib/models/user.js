(function () {
'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Mailbox = require('./mailbox.js');

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
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    mailboxes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Mailbox'
	}],
    tfa: {
        default: false,
        type: Boolean
    },
    tfaToken: {
        type: String
    }
});

UserSchema.pre('save', function(callback) {
    var user = this;

    if (!user.isModified('password')) return callback();

    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) {
			return callback(err);
		}
        user.password = hash;
        callback();
    });
});

UserSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) {
			return cb(err);
		}
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
}());
