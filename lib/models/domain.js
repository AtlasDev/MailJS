(function () {
'use strict';

var mongoose = require('mongoose');
var User = require('./user.js');

var DomainSchema = new mongoose.Schema({
    domain: {
		type: String,
		lowercase: true,
		index: true,
		trim: true,
		unique: true,
		required: true
	},
    disabled: {
		type: Boolean,
		default: false
	},
    admins: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}],
    users: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	created: {
		type: Date,
		default: Date.now
	}
	certificate: {
		type: String,
		required: true,
	},
	privateKey: {
		type: String,
		required: true,
	},
	ca: {
		type: String,
		required: true,
	},
	account: {
		type: String,
		required: true,
	},
	lastRefresh: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Domain', DomainSchema);
}());
