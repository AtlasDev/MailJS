(function () {
'use strict';

var User = require('../models/user.js');
var validator = require('validator');
var sys = require('./main.js');

/**
 * Create a new user.
 * @name createUser
 * @since 0.1.0
 * @version 2
 * @param {string} username Username to use.
 * @param {string} password Password to use.
 * @param {string} firstName First name of the user.
 * @param {string} lastName Last name of the user.
 * @param {createUserCallback} callback Callback function after creating the user.
 */

/**
 * @callback createUserCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} user User object of the new created user.
 */
exports.create = function (username, password, firstName, lastName, isAdmin, callback) {
    var error;
    if(username.length < 5) {
        error = new Error('Username does not meet the requirements!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    if(password.length < 7 || validator.isAlpha(password) || !/[a-z]/g.test(password) || !/[A-Z]/g.test(password)) {
        error = new Error('Password does not meet the requirements!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    var user = new User({
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        mailboxes: [],
        isAdmin: isAdmin
    });
    user.save(function(err) {
        if (err) {
            err.type = 500;
            return callback(err, null);
        }
        sys.util.log('User `'+user.username+'` created.');
        return callback(null, user);
    });
};

/**
 * Find a user by id.
 * @name findUser
 * @since 0.1.0
 * @version 1
 * @param {string} userID userID of the user to find.
 * @param {findUserCallback} callback Callback function after finding the user, returns false if none found.
 */

/**
 * @callback findUserCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} user User object of the found user.
 */
exports.find = function (userID, callback) {
    if (!validator.isMongoId(userID)) {
        var error = new Error('Invalid user ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    User.findById(userID, function (err, user) {
        if(err) {
            return callback(err);
        }
        if(!user) {
            return callback(null, false);
        }
        return callback(null, user);
    });
};

/**
 * Find a user by username.
 * @name findByUsernameUser
 * @since 0.1.0
 * @version 1
 * @param {string} username username of the user to find.
 * @param {findByUsernameUserCallback} callback Callback function after finding the user.
 */

/**
 * @callback findByUsernameUserCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} user User object of the found user, returns false if none.
 */
exports.findByUsername = function (username, callback) {
    User.findOne({username: username}, function (err, user) {
        if(err) {
            return callback(err);
        }
        if(!user) {
            return callback(null, false);
        }
        return callback(null, user);
    });
};

/**
 * Find a user by mailbox.
 * @name findByMailboxUser
 * @since 0.1.0
 * @version 1
 * @param {string} mailboxID Id of the mailbox to find by.
 * @param {findByMailboxUserCallback} callback Callback function after finding the user.
 */

/**
 * @callback findByMailboxUserCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Array|Boolean} users An array of user objects found, false if non found.
 */
exports.findByMailbox = function (mailboxID, callback) {
    if (!validator.isMongoId(mailboxID)) {
        var error = new Error('Invalid mailbox ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    User.find({mailboxes: mailboxID}, function (err, users) {
        if(err) {
            return callback(err);
        }
        if(!users) {
            return callback(null, false);
        }
        return callback(null, users);
    });
};

/**
 * Find all users.
 * @name findAll
 * @since 0.1.0
 * @version 1
 * @param {int} limitBy Amount of users to limit to. Default: 20
 * @param {int} skip Amount of users to skip before returning, can be used for pagination. Default: 0;
 * @param {findAllCallback} callback Callback function after finding all users.
 */

/**
 * @callback findAllCallback
 * @param {Error} err Error object, should be undefined.
 * @param {array} users Found users in a array.
 */
exports.findAll = function (limitBy, skip, callback) {
    limitBy = parseInt(limitBy) || 20;
    skip = parseInt(skip) || 0;
    var error;
    if (!validator.isInt(limitBy)) {
        error = new Error('Invalid limitBy value!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    if (!validator.isInt(skip)) {
        error = new Error('Invalid skip value!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    User.find({})
    .limit(limitBy)
    .skip(skip)
    .sort({name: 'asc'})
    .exec(function(err, users) {
        if (err) {
            return callback(err, null);
        }
        return callback(null, users);
    });
};

/**
 * Verify user creditals.
 * @name verifyUser
 * @since 0.1.0
 * @version 1
 * @param {string} username Username of the to verify user.
 * @param {password} password Password of the to verify user.
 * @param {verifyUserCallback} callback Callback function after verifying the user.
 */

/**
 * @callback verifyUserCallback
 * @param {Error} err Error object, should be undefined.
 * @param {boolean} isMatch Gives if the password and username matches.
 * @param {Object} user User object of the user (if it matches).
 */
exports.verify = function (username, password, callback) {
    User.findOne({username: username}, function (err, user) {
        if(err) {
            return callback(err);
        }
        if(!user) {
            return callback(null, false);
        }
        user.verifyPassword(password, function (err, isMatch) {
            if(err){
                return callback(err);
            }
            return callback(null, isMatch, user);
        });
    });
};

/**
 * Delete a user
 * @name deleteUser
 * @since 0.1.0
 * @version 1
 * @param {string} userID UserID of the user to be deleted.
 * @param {deleteUserCallback} callback Callback function after deleting the user
 */

/**
 * @callback deleteUserCallback
 * @param {Error} err Error object, should be undefined.
 */
exports.delete = function (userID, callback) {
    if (!validator.isMongoId(userID)) {
        var error = new Error('Invalid user ID!');
        error.name = 'EINVALID';
        error.type = 400;
        return callback(error);
    }
    User.findByIdAndRemove(userID, function(err, user) {
        if(err) {
            return callback(err);
        }
        if(user === null) {
            var error = new Error('The given id was not found.');
            error.name = 'ENOTFOUND';
            error.type = 400;
            return callback(error);
        } else {
            sys.client.deleteUser(userID, function (err) {
                if(err) {
                    return callback(err);
                }
                sys.util.log('User `'+user._id+'` deleted.');
                return callback(null);
            });
        }
    });
};
}());
