(function () {
'use strict';

var Invitation = require('../models/invitation.js');
var validator = require('validator');

/**
 * Create a invitation
 * @name createInvitation
 * @since 0.1.0
 * @version 1
 * @param {String} message Message attached to the invitation.
 * @param {createInvitationCallback} callback Callback function after creating the invitation
 */

/**
 * @callback createInvitationCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} invitation Invitation object after creating it.
 */
exports.create = function (message, cb) {
    var error;
    if(message && !validator.isAscii(message)) {
        error = new Error('Invalid message!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    var invite = new Invitation();
    invite.generate(function () {
        if(message) {
            invite.message = message;
        }
        invite.save(function (err) {
            if(err) {
                return cb(err);
            }
            return cb(null, invite);
        });
    });
};

/**
 * Use a code.
 * @name useInvitation
 * @since 0.1.0
 * @version 1
 * @param {String} code The code to be used.
 * @param {useInvitationCallback} callback Callback function after using the invitation
 */

/**
 * @callback useInvitationCallback
 * @param {Error} err Error object, should be undefined.
 */
exports.validate = function (code, cb) {
    if(code.length != 13) {
        error = new Error('Invalid invite!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    Invitation.findOne({code: code}, function (err, invite) {
        if(err) {
            return cb(err);
        }
        if(!invite) {
            error = new Error('Invalid invite!');
            error.name = 'EVALIDATION';
            error.type = 400;
            return cb(error);
        }
        invite.use(function (err) {
            if(err) {
                return cb(err);
            }
        });
    });
};
}());
