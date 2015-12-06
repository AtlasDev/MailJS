(function () {
'use strict';

var util = require('./util.js');
var Mailbox = require('../models/mailbox.js');
var Domain = require('../models/domain.js');
var User = require('../models/user.js');
var inboxFunc = require('./inbox.js');
var validator = require('validator');

/**
 * Create a new mailbox
 * @name createMailbox
 * @since 0.1.0
 * @version 2
 * @param {string} local Local part of the mail address to be registered, in the form of `info` for `info@example.com`.
 * @param {string} domainID ID of the domain to register the mailbox to.
 * @param {string} userID ID of the user to register the mailbox to.
 * @param {string} title Title of the mailbox, used as name when sending emails.
 * @param {string} transferable Set if the mailbox is transferable to other users.
 * @param {string} overwrite Overwrite the disabled check for the domain.
 * @param {createMailboxCallback} callback Callback function after creating the mailbox.
 */

/**
 * Callback for creating a new mailbox.
 * @callback createMailboxCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} mailbox Mailbox object of the new created mailbox.
 */
exports.create = function (local, domainID, userID, title, transferable, overwrite, callback) {
    var error;
    if (!validator.isMongoId(userID)) {
        error = new Error('Invalid user ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    if (!validator.isMongoId(domainID)) {
        error = new Error('Invalid domain ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    var localRegex = new RegExp(/^[a-z0-9,!#\$%&'\*\+/=\?\^_`\{\|}~-]+(\.[a-z0-9,!#\$%&'\*\+/=\?\^_`\{\|}~-]+)*/i);
    if(!localRegex.test(local) || local.length >= 65) {
        error = new Error('Invalid local part!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    overwrite = overwrite || false;
    //TODO: local part validation
    Domain.findById(domainID, function (err, domain) {
        var error;
        if(err) {
            return callback(err);
        }
        if(!domain) {
            error = new Error('Domain not found.');
            error.name = 'ENOTFOUND';
            error.type = 404;
            return callback(error);
        }
        if(domain.disabled === true) {
            if(overwrite !== true) {
                error = new Error('Specified domain has been disabled for registrations.');
                error.name = 'EDISABLED';
                error.type = 400;
                return callback(error);
            }
        }
        var address = local+'@'+domain.domain;
        Mailbox.findOne({address: address}, function (err, resMailbox) {
            if(err) {
                return callback(err);
            }
            if(resMailbox) {
                var error = new Error('Address already registered.');
                error.name = 'EOCCUPIED';
                error.type = 400;
                return callback(error);
            }
            var mailbox = new Mailbox();
            mailbox.address = address;
            mailbox.domain = domainID;
            mailbox.admins = [ userID ];
            mailbox.title = title;
            mailbox.creator = userID;
            mailbox.transferable = transferable;
            mailbox.generateTransferCode(function () {
                mailbox.save(function (err, mailbox) {
                    if(err) {
                        return callback(err);
                    }
                    inboxFunc.createDefaults(mailbox._id, function (err) {
                        if(err) {
                            return callback(err);
                        }
                        User.findByIdAndUpdate(
                            userID,
                            {$push: {"mailboxes": mailbox._id}},
                            {safe: true, upsert: true},
                            function(err) {
                                if(err) {
                                    return callback(err);
                                }
                                util.log('Mailbox `'+mailbox.address+'` created.');
                                return callback(null, mailbox);
                            }
                        );
                    });
                });
            });
        });
    });
};

/**
 * Find a mailbox by ID
 * @name findMailbox
 * @since 0.1.0
 * @version 1
 * @param {string} mailboxID ID of the mailbox to recieve.
 * @param {findMailboxCallback} callback Callback function after receiving the mailbox.
 */

/**
 * Callback for finding a mailbox.
 * @callback findMailboxCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object|Boolean} mailbox Mailbox object of the found mailbox, false if not found.
 */
exports.find = function (mailboxID, callback) {
    if (!validator.isMongoId(mailboxID)) {
        var error = new Error('Invalid mailbox ID!');
        error.name = 'EINVALID';
        error.type = 400;
        return callback(error);
    }
    Mailbox.findById(mailboxID, function (err, mailbox) {
        if(err) {
            return callback(err);
        }
        if(!mailbox) {
            return callback(null, false);
        }
        return callback(null, mailbox);
    });
};

/**
 * Verify a mail address
 * @name verifyMailbox
 * @since 0.1.0
 * @version 1
 * @param {string} mailAddress address of the mailbox to be verified.
 * @param {verifyMailboxCallback} callback Callback function after receiving the mailbox.
 */

/**
 * Callback for verifying a mail address.
 * @callback verifyMailboxCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Boolean} doesExists Boolean which gives if the address is valid.
 * @param {Object} mailbox The found mailbox. null if mailbox was invalid
 */
exports.verify = function (mailAddress, callback) {
    if (!validator.isEmail(mailAddress)) {
        var error = new Error('Invalid mail address!');
        error.name = 'EINVALID';
        error.type = 400;
        return callback(error);
    }
    Mailbox.findOne({address: mailAddress}, function (err, mailbox) {
        if(err) {
            return callback(err);
        }
        if(!mailbox) {
            return callback(null, false);
        }
        return callback(null, true, mailbox);
    });
};

/**
 * Claim a mailbox with a transfer code.
 * @name claimMailbox
 * @since 0.1.0
 * @version 2
 * @param {string} transferCode TransferCode to check.
 * @param {string} userID User ID of the user to add the mailbox to.
 * @param {claimMailboxCallback} callback Callback function after claiming the mailbox.
 */

/**
 * Callback for claiming a mailbox.
 * @callback claimMailboxCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} mailbox Mailbox object of the claimed mailbox.
 */
exports.claimMailbox = function (transferCode, userID, callback) {
    var error;
    if (!validator.isMongoId(userID)) {
        error = new Error('Invalid user ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    Mailbox.findOne({transferCode: transferCode}, function (err, mailbox) {
        var error;
        if(err) {
            return callback(err);
        }
        if(!mailbox) {
            error = new Error('Mailbox not found.');
            error.name = 'ENOTFOUND';
            error.type = 404;
            return callback(error);
        }
        if(mailbox.transferable === false) {
            error = new Error('Mailbox not transferable.');
            error.name = 'EDENIED';
            error.type = 400;
            return callback(error);
        }
        User.findById(userID, function (err, user) {
            var error;
            if(err) {
                return callback(err);
            }
            if(user.mailboxes.indexOf(mailbox._id) > -1) {
                error = new Error('User already member of the mailbox.');
                error.name = 'EOCCUPIED';
                error.type = 400;
                return callback(error);
            }
            user.mailboxes.push(mailbox._id);
            user.save(function (err) {
                if(err) {
                    return callback(err);
                }
                util.log('`'+user.username+'` claimed `'+mailbox.address+'`.');
                return callback(null, mailbox);
            });
        });
    });
};

/**
 * Set the transfer boolean of a mailbox.
 * @name setTransferable
 * @since 0.1.0
 * @version 1
 * @param {boolean} transferable The value of the transfer boolean.
 * @param {string} mailboxID Mailbox to be changed.
 * @param {string} userID User to check permissions for.
 * @param {setTransferableCallback} callback Callback function after changing the boolean
 */

/**
 * Callback for setting the transferable boolean.
 * @callback setTransferableCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} mailbox Mailbox object of the changed mailbox
 */
exports.setTransferable = function (transferable, mailboxID, userID, callback) {
    var error;
    if (!validator.isBoolean(transferable)) {
        error = new Error('transferable is not a boolean!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    if (!validator.isMongoId(mailboxID)) {
        error = new Error('Invalid mailbox ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    if (!validator.isMongoId(userID)) {
        error = new Error('Invalid user ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    Mailbox.findById(mailboxID, function (err, mailbox) {
        var error;
        if(err) {
            return callback(err);
        }
        if(!mailbox) {
            error = new Error('Mailbox not found.');
            error.name = 'ENOTFOUND';
            error.type = 404;
            return callback(error);
        }
        if(mailbox.creator == userID || mailbox.admins.indexOf(userID) != -1) {
            mailbox.transferable = transferable;
            mailbox.save(function (err) {
                if(err) {
                    return callback(err);
                }
                return callback(null, mailbox);
            });
        } else {
            error = new Error('Permission denied.');
            error.name = 'EPERMS';
            error.type = 403;
            return callback(error);
        }
    });
};

/**
 * Checks if a user is admin or creator of the given mailbox.
 * @name isAdmin
 * @since 0.1.0
 * @version 1
 * @param {string} mailboxID Mailbox to be checked against.
 * @param {string} userID User to check permissions for.
 * @param {isAdminCallback} callback Callback function after changing the boolean
 */

/**
 * Callback for checking the permissions
 * @callback isAdminCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Boolean} isAdmin Boolean which gives back if the user is an admin or creator.
 */
exports.isAdmin = function (mailboxID, userID, cb) {
    var error;
    if (!validator.isMongoId(mailboxID)) {
        error = new Error('Invalid mailbox ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    if (!validator.isMongoId(userID)) {
        error = new Error('Invalid user ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    exports.find(mailboxID, function (err, mailbox) {
        var error;
        if(err) {
            return cb(err);
        }
        if(mailbox === false) {
            error = new Error('Mailbox not found!');
            error.name = 'ENOTFOUND';
            error.type = 404;
            return cb(error);
        }
        if(mailbox.creator == userID || mailbox.admins.indexOf(userID) > -1) {
            return cb(null, true);
        } else {
            return cb(null, false);
        }
    });
};
}());
