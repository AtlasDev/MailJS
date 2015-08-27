var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    permissions: { type: [String], default: [] }
});

module.exports = mongoose.model('Group', GroupSchema);
