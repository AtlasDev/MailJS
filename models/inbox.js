var mongoose = require('mongoose');
var util = require('../util.js');

var InboxSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    mailbox: { type: String, required: true },
    editable: { type: Boolean, default: true }
});

module.exports = mongoose.model('Inbox', InboxSchema);
