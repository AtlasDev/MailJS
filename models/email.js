var mongoose = require('mongoose');

var EmailSchema  = new mongoose.Schema({
  mailbox: { type: mongoose.Schema.Types.ObjectId, required: true },
  creationTime: { type: Number, required: true },
  sender: { type: String, required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true }
});

module.exports = mongoose.model('Email', EmailSchema);
