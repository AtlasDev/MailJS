(function () {
'use strict';

var mongoose = require('mongoose');

var InboxSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mailbox: { type: String, required: true },
    editable: { type: Boolean, default: true }
});

module.exports = mongoose.model('Inbox', InboxSchema);
}());
