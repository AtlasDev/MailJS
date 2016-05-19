(function () {
'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Mailbox = require('./mailbox.js');
var Group = require('./group.js');
var error = require('../error.js');
var validate = require('../validate.js');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
		index: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
		index: true,
        type: String
    },
    lastName: {
		index: true,
        type: String
    },
    mailboxes: [{
		type: mongoose.Schema.Types.ObjectId,
		index: true,
		ref: 'Mailbox'
	}],
    groups: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Group',
		index: true,
		required: true
	}],
    tfa: {
        default: false,
        type: Boolean
    },
    tfaToken: {
        type: String
    }
});

UserSchema.pre('save', function(next) {
    var user = this;

	if(!validate.name(this.username)) {
		next(error.validation('Invalid user username.'));
		return;
	}

	if(!validate.password(this.password)) {
		next(error.validation('Invalid user password.'));
		return;
	}

	// Hash passwords
    if (user.isModified('password')) {
	    bcrypt.hash(user.password, 10, function(err, hash) {
	        if (err) {
				return next(err);
			}
	        user.password = hash;
	        next();
	    });
	} else {
		next();
	}
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
