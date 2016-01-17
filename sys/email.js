(function () {
'use strict';

var Email = require('../models/email.js');
var validator = require('validator');
var inbox = require('./inbox.js');
var mailbox = require('./mailbox.js');
var os = require('os');
var striptags = require('striptags');

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
        if(mail.attachments) {
            mail.attachmentsMeta = [];
            for (var i = 0; i < mail.attachments.length; i++) {
                mail.attachmentsMeta[i] = mail.attachments[i];
                mail.attachmentsMeta[i].content = undefined;
                if(i == mail.attachments.length - 1) {
                    createHelper(mail, content, inbox, mailboxID, cb);
                }
            }
        } else {
            createHelper(mail, content, inbox, mailboxID, cb);
        }
    });
};

//Helper for the create function
var createHelper = function (mail, content, inbox, mailboxID, cb) {
    var email = new Email();
    email.inbox = inbox._id;
    email.mailbox = mailboxID;
    email.creationDate = new Date();
    email.reportedDate = mail.receivedDate || new Date();
    email.sender = mail.from[0].address;
    email.senderDisplay = mail.from[0].name;
    email.subject = mail.subject;
    email.content = striptags(content.trim(), [
        'a', 'b', 'i', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 's', 'br', 'font', 'p', 'strong',
        'em', 'small', 'marked', 'del', 'sub', 'sup', 'span', 'li' , 'ul', 'ol'
    ]);
    email.attachments = mail.attachments;
    email.attachmentsMeta = mail.attachmentsMeta;
    if(mail.attachments) {
        email.attachmentsCount = mail.attachments.length;
    }
    if(mail.text) {
        email.preview = mail.text.trim().substr(0, 100);
    } else {
        email.preview = '';
    }
    email.receivedBy = os.hostname();
    email.save(function (err) {
        if(err) {
            return cb(err);
        }
        return cb(null, email);
    });
};

/**
 * Get emails from a inbox, does not include content
 * @name getEmails
 * @since 0.1.0
 * @version 1
 * @param {MongoID} mailboxID The id of the mailbox to get the emails from.
 * @param {Number} limit Amount to limit the to gain emails.
 * @param {String} skip Skip an amount of emails before returning.
 * @param {getEmailsCallback} callback Callback function after getting the emails.
 */

/**
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
    Email.find({inbox: inboxID}).sort('-reportedDate').skip(skip).limit(limit).select('-content -attachments -attachmentsMeta').exec(function (err, mails) {
        if(err) {
            return cb(err);
        }
        return cb(null, mails);
    });
};

/**
 * Get an specific email
 * @name getEmail
 * @since 0.1.0
 * @version 1
 * @param {MongoID} emailJD The id of the mailbox to get the emails from.
 * @param {Array|MongoID} mailboxes Array of mailboxes the user has access to.
 * @param {getEmailCallback} callback Callback function after getting the email.
 */

/**
 * @callback getEmailCallback
 * @param {Error} err Error object, should be undefined or passed trough.
 * @param {Object} email The email object.
 */
exports.getEmail = function (emailID, mailboxes, cb) {
    var error;
    if (!validator.isMongoId(emailID)) {
        error = new Error('Invalid email ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    Email.findById(emailID).select('-attachments').exec(function (err, mail) {
        if(err) {
            return cb(err);
        }
        if(!mail) {
            error = new Error('Mail not found!');
            error.name = 'ENOTFOUND';
            error.type = 400;
            return cb(error);
        }
        if(mailboxes.indexOf(mail.mailbox) == -1) {
            error = new Error('Permissions denied!');
            error.name = 'EPERM';
            error.type = 401;
            return cb(error);
        }
        return cb(null, mail);
    });
};

/**
 * Delete a specific email
 * @name DeleteEmail
 * @since 0.1.0
 * @version 1
 * @param {MongoID} emailJD The id of the mailbox to be deleted.
 * @param {Array|MongoID} mailboxes Array of mailboxes the user has access to.
 * @param {deleteEmailCallback} callback Callback function after deleting the mail.
 */

/**
 * @callback deleteEmailCallback
 * @param {Error} err Error object, should be undefined or passed trough.
 * @param {Object} email The email object deleted.
 */
exports.deleteEmail = function (emailID, mailboxes, cb) {
    var error;
    if (!validator.isMongoId(emailID)) {
        error = new Error('Invalid email ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    Email.findById(emailID).select('-attachments').exec(function (err, mail) {
        if(err) {
            return cb(err);
        }
        if(!mail) {
            error = new Error('Mail not found!');
            error.name = 'ENOTFOUND';
            error.type = 400;
            return cb(error);
        }
        if(mailboxes.indexOf(mail.mailbox) == -1) {
            error = new Error('Permissions denied!');
            error.name = 'EPERM';
            error.type = 401;
            return cb(error);
        }
        mail.remove(function (err) {
            if(err) {
                return cb(err);
            }
            return cb(null, mail);
        });
    });
};
}());
