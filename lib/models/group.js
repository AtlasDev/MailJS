(function () {
'use strict';

var mongoose = require('mongoose');
var error = require('../error.js');
var validate = require('../validate.js');

var GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
		index: true,
		required: true
    },
    color: {
        type: String,
        default: '#000'
    },
    permissions: {
        type: [String]
    },
	updated: {
		type: Date,
		default: Date.now
	},
	created: {
		type: Date,
		default: Date.now
	}
});

GroupSchema.pre('save', function(next) {
	// Reset last updated.
	this.updated = Date.now;

	if(!validate.name(this.name)) {
		next(error.validation('Invalid group name.'));
		return;
	}

	if(!validate.colorHex(this.color)) {
		if(this.color == '') {
			this.color = '#000';
		} else {
			next(error.validation('Invalid group color.'));
			return;
		}
	}

	if(!validate.array(this.permissions)) {
		next(error.validation('Invalid group permissions.'));
		return;
	}
});

module.exports = mongoose.model('Group', GroupSchema);
}());
