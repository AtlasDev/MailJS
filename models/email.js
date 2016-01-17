(function () {
'use strict';

var mongoose = require('mongoose');

var EmailSchema  = new mongoose.Schema({
    inbox: { type: mongoose.Schema.Types.ObjectId, required: true },
    mailbox: { type: mongoose.Schema.Types.ObjectId, required: true },
    creationDate: { type: Date, required: true },
    reportedDate: { type: Date },
    sender: { type: String, required: true },
    senderDisplay: { type: String },
    content: { type: String, required: true },
    preview: { type: String, required: true },
    subject: { type: String, required: true },
    attachmentsCount: { type: Number, default: 0 },
    attachmentsMeta: { type: [], default: [] },
    attachments: { type: [], default: [] },
    receivedBy: { type: String, required: true }
});

module.exports = mongoose.model('Email', EmailSchema);
}());
