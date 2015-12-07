(function () {
'use strict';

var mongoose = require('mongoose');

var InboxSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mailbox: { type: mongoose.Schema.Types.ObjectId, required: true },
    editable: { type: Boolean, default: true },
    type: { type: String }
});

module.exports = mongoose.model('Inbox', InboxSchema);
}());
