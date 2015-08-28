var util = require('../util.js');
var User = require('../models/user.js');
var clientFunc = require('./client.js');

/**
 * Create a new user.
 * @name createUser
 * @since 0.1.0
 * @version 1
 * @param {string} username Username to use.
 * @param {string} password Password to use.
 * @param {string} group Group ID of the group to add the user to.
 * @param {createUserCallback} callback Callback function after creating the user.
 */

/**
 * Callback for creating a new user.
 * @callback createUserCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} user User object of the new created user.
 */
exports.create = function (username, password, group, callback) {
    var user = new User({
        username: username,
        password: password,
        group: group,
        mailboxes: []
    });
    user.save(function(err) {
        if (err) {
            return callback(err, null);
        }
        util.log('User `'+user.username+'` created.');
        return callback(null, user);
    });
}

/**
 * Find a user by id.
 * @name findUser
 * @since 0.1.0
 * @version 1
 * @param {string} userID userID of the user to find.
 * @param {findUserCallback} callback Callback function after finding the user.
 */

/**
 * Callback for finding a user.
 * @callback findUserCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} user User object of the found user.
 */
exports.find = function (userID, callback) {
    User.findById(userID, function (err, user) {
        if(err) {
            return callback(err);
        }
        if(!user) {
            var error = new Error('Could not find user.');
            error.name = 'ENOTFOUND';
            return callback(error);
        }
        return callback(null, user);
    })
}

/**
 * Find a user by username.
 * @name findByUsernameUser
 * @since 0.1.0
 * @version 1
 * @param {string} username username of the user to find.
 * @param {findByUsernameUserCallback} callback Callback function after finding the user.
 */

/**
 * Callback for finding a user.
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
    })
}

/**
 * Find all users with a certain group.
 * @name findByGroupUser
 * @since 0.1.0
 * @version 1
 * @param {string} groupID Group ID of the users to find.
 * @param {findByGroupUserCallback} callback Callback function after finding the user.
 */

/**
 * Callback for finding a user.
 * @callback findByGroupUserCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Array} users Array of user objects, returns false if none.
 */
exports.findByGroup = function (groupID, callback) {
    User.find({group: groupID}, function (err, users) {
        if(err) {
            return callback(err);
        }
        if(!users) {
            return callback(null, false);
        }
        return callback(null, users);
    })
}

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
 * Callback for verifying a user.
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
                util.log('User `'+user._id+'` deleted.');
                return callback(null);
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
 * @param {string} newgroup New group id.
 * @param {UpdateGroupUserCallback} callback Callback function after updating the group of a user.
 */

/**
 * Callback for Updating a users group
 * @callback UpdatGroupUserCallback
 * @param {Error} err Error object, should be undefined.
 */
exports.changeGroup = function (userID, newgroup, callback) {
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
            util.log('Group of user `'+user.username+'` changed to group `'+user.group+'`.');
            return callback(null);
        });
    });
}
