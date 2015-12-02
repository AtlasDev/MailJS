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
exports.create = function (mailboxID, mail, cb) {
    var content = mail.html || mail.text;
    if (!validator.isMongoId(mailboxID)) {
        var error = new Error('Invalid mailbox ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    if (!validator.isEmail(mail.from[0].address)) {
        var error = new Error('Invalid sender!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    if (typeof mail.subject != "string") {
        var error = new Error('Invalid subject!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    if (typeof content != "string") {
        var error = new Error('Invalid content!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    var email = new Email();
    email.mailbox = mailboxID;
    email.creationDate = Date.now();
    email.reportedDate = mail.receivedDate;
    email.sender = mail.from[0].address;
    email.senderDisplay = mail.from[0].name;
    email.subject = subject;
    email.content = content;
    email.save(function (err) {
        if(err) {
            return cb(err);
        }
        return cb(null, email);
    });
}
