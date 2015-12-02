var mongoose = require('mongoose');

var EmailSchema  = new mongoose.Schema({
    mailbox: { type: mongoose.Schema.Types.ObjectId, required: true },
    creationDate: { type: Number, required: true },
    reportedDate: { type: Number },
    sender: { type: String, required: true },
    senderDisplay: { type: String },
    content: { type: String, required: true },
    subject: { type: String, required: true },
});

module.exports = mongoose.model('Email', EmailSchema);
