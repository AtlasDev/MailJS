(function () {
'use strict';

var mongoose = require('mongoose');
var Mailbox = require('./mailbox.js');
var Inbox = require('./inbox.js');

var EmailSchema  = new mongoose.Schema({
    inbox: {
		type: mongoose.Schema.Types.ObjectId,
		index: true,
		ref: 'Inbox',
		required: true
	},
    mailbox: {
		type: mongoose.Schema.Types.ObjectId,
		index: true,
		ref: 'Mailbox',
		required: true
	},
    creationDate: {
		type: Date,
		required: true
	},
    reportedDate: {
		type: Date
	},
    sender: {
		type: String,
		index: true,
		required: true
	},
    senderDisplay: {
		type: String
	},
    content: {
		type: String
	},
    preview: {
		type: String
	},
    subject: {
		index: true,
		type: String
	},
    attachmentsCount: {
		type: Number,
		index: true,
		default: 0
	},
    attachmentsMeta: {
		type: []
	},
    attachmentsIDs: {
		type: [String]
	},
    attachments: {
		type: Array
	},
    receivedBy: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('Email', EmailSchema);
}());
