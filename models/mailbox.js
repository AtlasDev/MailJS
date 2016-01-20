(function () {
'use strict';

var mongoose = require('mongoose');

var MailboxSchema = new mongoose.Schema({
    address: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    admins: {type: [String], default: [] },
    creator: {type: String, required: true},
    domain: {type: String, required: true}
});

module.exports = mongoose.model('Mailbox', MailboxSchema);
}());
