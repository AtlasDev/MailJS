var Email = require('../models/email.js');
var validator = require('validator');

/**
 * Create a new email
 * @name createEmail
 * @since 0.1.0
 * @version 1
 * @param {String} mailboxID ID of the mailbox to add the email to.
 * @param {string} sender Envelope of the sender of the email.
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
exports.create = function (mailboxID, sender, subject, content, cb) {
    if (!validator.isMongoId(mailboxID)) {
        var error = new Error('Invalid mailbox ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    if (!validator.isEmail(sender)) {
        var error = new Error('Invalid sender!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    if (!validator.isAscii(subject)) {
        var error = new Error('Invalid subject!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    if (!validator.isAscii(content)) {
        var error = new Error('Invalid content!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    var email = new Email();
    email.mailbox = mailboxID;
    email.creationTime = Date.now();
    email.sender = sender;
    email.subject = subject;
    email.content = content;
    email.save(function (err) {
        if(err) {
            return cb(err);
        }
        return cb(null, email);
    });
}
