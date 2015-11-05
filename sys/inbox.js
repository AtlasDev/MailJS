var Inbox = require('../models/inbox.js');
var util = require('../util.js');
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
    var junk = new Inbox();
    junk.name = 'Junk';
    junk.mailbox = mailboxID;
    junk.editable = false;
    var trash = new Inbox();
    trash.name = 'Trash';
    trash.mailbox = mailboxID;
    trash.editable = false;
    var send = new Inbox();
    send.name = 'Send';
    send.mailbox = mailboxID;
    send.editable = false;
    inbox.save(function (err) {
        if(err) {
            return callback(err);
        }
        junk.save(function (err) {
            if(err) {
                return callback(err);
            }
            trash.save(function (err) {
                if(err) {
                    return callback(err);
                }
                send.save(function (err) {
                    if(err) {
                        return callback(err);
                    }
                    return callback();
                });
            });
        });
    });
}

/**
 * Get all inboxes of a mailbox
 * @name GetInboxes
 * @since 0.1.0
 * @version 1
 * @param {string} mailboxID Id of the mailbox to get the mailboxes of.
 * @param {GetInboxesCallback} callback Callback function after getting all inboxes.
 */

/**
 * Callback for getting all mailboxes
 * @callback GetInboxesCallback
 * @param {Error} err Error object, should be undefined.
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
}
