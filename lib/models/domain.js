(function () {
'use strict';

var mongoose = require('mongoose');
var User = require('./user.js');

var DomainSchema = new mongoose.Schema({
    domain: { type: String, lowercase: true, trim: true, unique: true, required: true },
    disabled: { type: Boolean, default: false },
    admin: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
    users: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}]
});

module.exports = mongoose.model('Domain', DomainSchema);
}());
