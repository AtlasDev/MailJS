(function () {
'use strict';

var mongoose = require('mongoose');

var DomainSchema = new mongoose.Schema({
    domain: { type: String, lowercase: true, trim: true, unique: true, required: true },
    disabled: { type: Boolean, default: false },
    admin: { type: mongoose.Schema.Types.ObjectId, required: true },
    users: { type: [mongoose.Schema.Types.ObjectId], default: [] }
});

module.exports = mongoose.model('Domain', DomainSchema);
}());
