(function () {
'use strict';

var mongoose = require('mongoose');
var Mailbox = require('./mailbox.js');
var Inbox = require('./inbox.js');

var EmailSchema  = new mongoose.Schema({
    inbox: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Inbox',
		required: true
	},
    mailbox: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Mailbox',
		required: true
	},
    creationDate: { type: Date, required: true },
    reportedDate: { type: Date },
    sender: { type: String, required: true },
    senderDisplay: { type: String },
    content: { type: String, default: '' },
    preview: { type: String, default: '' },
    subject: { type: String, default: '' },
    attachmentsCount: { type: Number, default: 0 },
    attachmentsMeta: { type: [], default: [] },
    attachmentsIDs: { type: [String], default: [] },
    attachments: { type: Array, default: [] },
    receivedBy: { type: String, required: true }
});

module.exports = mongoose.model('Email', EmailSchema);
}());
