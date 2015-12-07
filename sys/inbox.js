(function () {
'use strict';

var Inbox = require('../models/inbox.js');
var validator = require('validator');

/**
 * Create default inboxes for a mailbox
 * @name createDefaults
 * @since 0.1.0
 * @version 1
 * @param {string} mailboxID Id of the mailbox to create the defaults for.
 * @param {createDefaultsCallback} callback Callback function after creating the defaults.
 */

/**
 * Callback for create default inboxes
 * @callback createDefaultsCallback
 * @param {Error} err Error object, should be undefined.
 */
exports.createDefaults = function (mailboxID, callback) {
    if (!validator.isMongoId(mailboxID)) {
        var error = new Error('Invalid mailbox ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    var inbox = new Inbox();
    inbox.name = 'Inbox';
    inbox.mailbox = mailboxID;
    inbox.editable = false;
    inbox.save(function (err) {
        if(err) {
            return callback(err);
        }
        var junk = new Inbox();
        junk.name = 'Junk';
        junk.mailbox = mailboxID;
        junk.editable = false;
        junk.save(function (err) {
            if(err) {
                return callback(err);
            }
            var trash = new Inbox();
            trash.name = 'Trash';
            trash.mailbox = mailboxID;
            trash.editable = false;
            trash.save(function (err) {
                if(err) {
                    return callback(err);
                }
                var send = new Inbox();
                send.name = 'Send';
                send.mailbox = mailboxID;
                send.editable = false;
                send.save(function (err) {
                    if(err) {
                        return callback(err);
                    }
                    return callback();
                });
            });
        });
    });
};

/**
 * Get all inboxes of a mailbox
 * @name getInboxes
 * @since 0.1.0
 * @version 1
 * @param {string} mailboxID Id of the mailbox to get the mailboxes of.
 * @param {GetInboxesCallback} callback Callback function after getting all inboxes.
 */

/**
 * Callback for getting all mailboxes
 * @callback GetInboxesCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Array} inboxes Array of inbox objects.
 */
exports.getInboxes = function (mailboxID, cb) {
    if (!validator.isMongoId(mailboxID)) {
        var error = new Error('Invalid mailbox ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    Inbox.find({mailbox: mailboxID}, function (err, inboxes) {
        if(err) {
            return cb(err);
        }
        return cb(null, inboxes);
    });
};

/**
 * Create a inbox
 * @name createInbox
 * @since 0.1.0
 * @version 1
 * @param {string} mailboxID Id of the mailbox to add the mailbox to.
 * @param {string} title Title of the inbox.
 * @param {createInboxCallback} callback Callback function after creating a mailbox.
 */

/**
 * Callback for creating a inbox.
 * @callback createInboxCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} inbox New created inbox.
 */
exports.createInbox = function (mailboxID, title, cb) {
    var error;
    if (!validator.isMongoId(mailboxID)) {
        error = new Error('Invalid mailbox ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    if (!validator.isAscii(title) || title.length < 4 || title.length > 64) {
        error = new Error('Invalid inbox title!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    var inbox = new Inbox();
    inbox.name = title;
    inbox.mailbox = mailboxID;
    inbox.editable = true;
    inbox.save(function (err) {
        if(err) {
            return cb(err);
        }
        return cb(null, inbox);
    });
};

/**
 * get an inbox by id
 * @name getInbox
 * @since 0.1.0
 * @version 1
 * @param {string} inboxID Id of the inbox to get.
 * @param {getInboxCallback} callback Callback function after getting the inbox.
 */

/**
 * Callback for getting a inbox.
 * @callback getInboxCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} inbox Inbox object.
 */
exports.get = function (inboxID, cb) {
    var error;
    if (!validator.isMongoId(inboxID)) {
        error = new Error('Invalid inbox ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    Inbox.findById(inboxID, function (err, inbox) {
        if(err) {
            return cb(err);
        }
        return cb(null, inbox);
    });
};
}());
