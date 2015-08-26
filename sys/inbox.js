var Inbox = require('../models/inbox.js');
var util = require('../util.js');

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
