var util = require('../util.js');
var User = require('../models/user.js');
var clientFunc = require('./client.js');
var Mailbox = require('../models/mailbox.js');

/**
 * Create a new user.
 * @name createUser
 * @since 0.1.0
 * @version 1
 * @param {string} username Username to use.
 * @param {string} password Password to use.
 * @param {string} mailboxID Initial mailbox ID to assign the user to.
 * @param {createUserCallback} callback Callback function after creating the user.
 */

/**
 * Callback for creating a new user.
 * @callback createUserCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} user User object of the new created user.
 */
exports.create = function (username, password, mailboxID, callback) {
    Mailbox.findById(mailboxID, function (err, mailbox) {
        if(err) {
            return callback(err, null);
        }
        if(!mailbox) {
            var error = new Error('Mailbox ID not found.');
            error.name = 'ENOTFOUND';
            return callback(error, null);
        }
        var user = new User({
            username: username,
            password: password,
            mailbox: [ mailboxID ],
            group: 1
        });
        user.save(function(err) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, user);
        });
    });
}

/**
 * Delete a user
 * @name deleteUser
 * @since 0.1.0
 * @version 1
 * @param {string} userID UserID of the user to be deleted.
 * @param {deleteUserCallback} callback Callback function after deleting the user
 */

/**
 * Callback for deleting a user.
 * @callback deleteUserCallback
 * @param {Error} err Error object, should be undefined.
 */
exports.delete = function (userID, callback) {
    User.findByIdAndRemove(userID, function(err, user) {
        if(err) {
            return callback(err);
        }
        if(user == null) {
            var error = new Error('The given id was not found.');
            error.name = 'ENOTFOUND';
            return callback(error);
        } else {
            clientFunc.deleteUser(userID, function (err) {
                if(err) {
                    return callback(err);
                }
                return callback(null);
                util.log('User `'+user._id+'` deleted.');
            })
        }
    });
}

/**
 * Change the group of a user
 * @name updateGroupUser
 * @since 0.1.0
 * @version 1
 * @param {string} userID User id of the user to change the group of.
 * @param {Int} newgroup New group id of the user.
 * @param {UpdateGroupUserCallback} callback Callback function after updating the group of a user.
 */

/**
 * Callback for Updating a users group
 * @callback UpdatGroupUserCallback
 * @param {Error} err Error object, should be undefined.
 */
exports.changeGroup = function (userID, newgroup, callback) {
    if(newgroup < 1 || newgroup > 3) {
        var error = new Error('Invalid group id.');
        error.name = 'EINVALID';
        return callback(error);
    }
    User.findById(userID, function (err, user) {
        if(err) {
            return callback(err);
        }
        if(!user) {
            var error = new Error('User not found.');
            var name = 'ENOTFOUND';
            return callback(error);
        }
        user.group = newgroup;
        user.save(function (err) {
            if(err) {
                return callback(err);
            }
            return callback(null);
        });
    });
}
