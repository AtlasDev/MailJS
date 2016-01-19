(function () {
'use strict';

var mongoose = require('mongoose');
var sys = require('../sys/main.js');

var InvitationSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    message: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 345600000
    }
});

InvitationSchema.methods.generate = function(cb) {
    this.code = sys.util.uid(4)+'-'+sys.util.uid(4)+'-'+sys.util.uid(3);
    cb();
};

InvitationSchema.methods.isValid = function(cb) {
    if(new Date(this.createdAt.getTime() + 345600000).getTime() <= new Date().getTime()) {
        this.remove(function (err) {
            if(err) {
                return cb(err, false);
            }
        });
        return cb(null, false);
    }
    return cb(null, true);
};

InvitationSchema.methods.use = function(cb) {
    var self = this;
    this.isValid(function (err, isValid) {
        if(err) {
            return cb(err);
        }
        if(isValid === false) {
            return cb(new Error('Code is invalid'));
        }
        self.remove(function (err) {
            if(err) {
                return cb(err);
            }
            return cb();
        });
    });
};

module.exports = mongoose.model('Invitation', InvitationSchema);
}());
