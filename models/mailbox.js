var mongoose = require('mongoose');
var util = require('../util.js');

var MailboxSchema = new mongoose.Schema({
    address: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    admins: {type: [String], default: [] },
    creator: {type: String, required: true},
    domain: {type: String, required: true},
    smtpToken: {type: String },
    transferable: { type: Boolean, default: true },
    transferCode: { type: String }
});

MailboxSchema.methods.generateTransferCode = function(cb) {
    var _this = this;
    var code = util.uid(15);
    this.transferCode = code;
    cb();
};

MailboxSchema.methods.generateSMTPToken = function(cb) {
    var _this = this;
    var code = util.uid(12);
    this.smtpToken = code;
    cb();
};

module.exports = mongoose.model('Mailbox', MailboxSchema);
