var mongoose = require('mongoose');
var util = require('../util.js');

var MailboxSchema = new mongoose.Schema({
    address: { type: String, required: true, unique: true },
    admins: {type: [String], default: [] },
    domain: {type: String, required: true},
    transferable: { type: Boolean, default: true },
    transferCode: { type: String }
});

MailboxSchema.methods.generateTransferCode = function(cb) {
    var _this = this;
    var code = util.uid(10);
    this.transferCode = code;
    cb();
};

module.exports = mongoose.model('Mailbox', MailboxSchema);
