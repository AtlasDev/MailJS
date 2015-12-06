(function () {
'use strict';

var mongoose = require('mongoose');

var DomainSchema = new mongoose.Schema({
    domain: { type: String, required: true },
    disabled: { type: Boolean, default: false }
});

module.exports = mongoose.model('Domain', DomainSchema);
}());
