(function () {
'use strict';

var Email = require('../models/email.js');
var validator = require('validator');
var inbox = require('./inbox.js');
var mailbox = require('./mailbox.js');

/**
 * Create a new email
 * @name createEmail
 * @since 0.1.0
 * @version 1
 * @param {String} mailboxID ID of the mailbox to add the email to.
 * @param {String} sender Envelope of the sender of the email.
 * @param {String} subject The subject of the email.
 * @param {String} content The content of the email.
 * @param {createEmailCallback} callback Callback function after creating a new email.
 */

/**
 * Callback for creating a new email.
 * @callback createEmailCallback
 * @param {Error} err Error object, should be undefined or passed trough.
 * @param {Object} email The newly created email.
 */
exports.create = function (mailboxID, mail, cb) {
    var content = mail.html || mail.text;
    var error;
    if (!validator.isMongoId(mailboxID)) {
        error = new Error('Invalid mailbox ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    if (!validator.isEmail(mail.from[0].address)) {
        error = new Error('Invalid sender!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    if (typeof mail.subject != "string") {
        error = new Error('Invalid subject!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    if (typeof content != "string") {
        error = new Error('Invalid content!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    mailbox.getInbox(mailboxID, function (err, inbox) {
        var error;
        if(err) {
            return cb(err);
        }
        if(!inbox) {
            error = new Error('mailbox not found!');
            error.name = 'ENOTFOUND';
            error.type = 400;
            return cb(error);
        }
        var email = new Email();
        email.inbox = inbox._id;
        email.creationDate = Math.round((new Date()).getTime() / 1000);
        email.reportedDate = Math.round(mail.receivedDate.getTime() / 1000) || Math.round((new Date()).getTime() / 1000);
        email.sender = mail.from[0].address;
        email.senderDisplay = mail.from[0].name;
        email.subject = mail.subject;
        email.content = content;
        email.preview = mail.text.trim().substr(0, 100);
        email.save(function (err) {
            if(err) {
                return cb(err);
            }
            return cb(null, email);
        });
    });
};

/**
 * Get emails from a inbox
 * @name getEmails
 * @since 0.1.0
 * @version 1
 * @param {String} mailboxID The id of the mailbox to get the emails from.
 * @param {Number} limit Amount to limit the to gain emails.
 * @param {String} skip Skip an amount of emails before returning.
 * @param {getEmailsCallback} callback Callback function after getting the emails.
 */

/**
 * Callback for creating a new email.
 * @callback getEmailsCallback
 * @param {Error} err Error object, should be undefined or passed trough.
 * @param {Object} emails Preview of the found emails.
 */
exports.getEmails = function (inboxID, limit, skip, cb) {
    var error;
    if (!validator.isMongoId(inboxID)) {
        error = new Error('Invalid mailbox ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    if (typeof limit != "number" || limit > 100 || limit <= 0) {
        error = new Error('Invalid limit!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    if (typeof skip != "number" || skip < 0) {
        error = new Error('Invalid skip!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    Email.find({inbox: inboxID}).sort('reportedDate').skip(skip).limit(limit).select('-content').exec(function (err, emails) {
        if(err) {
            return cb(err);
        }
        return cb(null, emails);
    });
};
}());
