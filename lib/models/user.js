(function () {
'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Mailbox = require('./mailbox.js');
var Group = require('./group.js');
var error = require('../error.js');
var validate = require('../validate.js');
var avatar = require('../avatar.js');

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
	avatar: {
		type: Buffer,
		required: true
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

	// Validation
	if(!validate.name(user.username)) {
		next(error.validation('Invalid user username.'));
		return;
	}
	if(!validate.password(user.password)) {
		next(error.validation('Invalid user password.'));
		return;
	}

	// Password hashing
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

UserSchema.pre('validate', function(next) {
    var user = this;

	// Avatar generation
	if(!user.avatar) {
		avatar.getRandom().then(function (avatar) {
			user.avatar = avatar;
			next();
		}).catch(next);
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
