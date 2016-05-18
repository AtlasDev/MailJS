(function () {
'use strict';

var mongoose = require('mongoose');
var User = require('./user.js');

var MailboxSchema = new mongoose.Schema({
    address: {
		type: String,
		required: true,
		index: true,
		unique: true
	},
    title: {
		type: String,
		required: true
	},
    admins: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
    creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
    domain: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('Mailbox', MailboxSchema);
}());
