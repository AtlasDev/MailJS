var Group = require('../models/group.js');

/**
 * Get all groups.
 * @name getGroups
 * @since 0.1.0
 * @version 1
 * @param {getGroupsCallback} callback Callback function after getting all groups.
 */

/**
 * Callback for getting all groups.
 * @callback getGroupsCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Array} groups All groups available.
 */
exports.getGroups = function (callback) {
    Group.find(function (err, groups) {
        if(err) {
            return callback(err);
        }
        return callback(null, groups);
    })
}

/**
 * Get a specific group.
 * @name getGroup
 * @since 0.1.0
 * @version 1
 * @param {string} groupID ID of the group requested.
 * @param {getGroupCallback} callback Callback function after getting a group.
 */

/**
 * Callback for getting a group.
 * @callback getGroupCallback
 * @param {Error} err Error object, should be undefined.
 * @param {object} group The requested group.
 */
exports.getGroup = function (groupID, callback) {
    if (!groupID.match(/^[0-9a-fA-F]{24}$/)) {
        var error = new Error('Invalid group ID!');
        error.name = 'EINVALID';
        return callback(error);
    }
    Group.findById(groupID, function (err, group) {
        if(err) {
            return callback(err);
        }
        return callback(null, group);
    })
}

/**
 * Create a new group
 * @name createGroup
 * @since 0.1.0
 * @version 1
 * @param {string} name A indentification name, like `Admin`, `Mod` or `User`. (these examples are autocreated!)
 * @param {string|null} type The name of the group of groups the new group belongs. No opperating reason, just for sorting. Copies from masterGroup if null, throws error if masterGroup is also null.
 * @param {string|array} masterGroup Group ID it should copy the propperties from. Creates a group with the permissions array if it is an array.
 * @param {createGroupCallback} callback Callback function after creating the group.
 */

/**
 * Callback for getting all groups.
 * @callback getGroupsCallback
 * @param {Error} err Error object, should be undefined or passed trough.
 * @param {object} group The new created group.
 */
exports.createGroup = function (name, type, masterGroup, callback) {
    if(!name) {
        var error = new Error('Name not set');
        error.name = 'EINVALID';
        return callback(error);
    }
    if(!masterGroup && !type) {
        var error = new Error('Type AND masterGroup not set.');
        error.name = 'EINVALID';
        return callback(error);
    }
    if(typeof masterGroup == "string") {
        Group.findById(masterGroup, function (err, responseMasterGroup) {
            if(err) {
                return callback(err);
            }
            if(!responseMasterGroup) {
                var error = new Error('Master group not found');
                error.name = 'ENOTFOUND';
                return callback(error);
            }
            type = type || responseMasterGroup.type;
            groupCreateHelper(name, type, responseMasterGroup.permissions, function (err, group) {
                if(err) {
                    return callback(err);
                }
                return callback(null, group);
            })
        });
    } else {
        groupCreateHelper(name, type, masterGroup, function (err, group) {
            if(err) {
                return callback(err);
            }
            return callback(null, group);
        });
    }
}

var groupCreateHelper = function (name, type, perms, callback) {
    var group = new Group();
    group.name = name;
    group.type = type;
    group.permissions = perms;
    group.save(function (err) {
        if(err) {
            return callback(err);
        }
        return callback(null, group);
    });
}

/**
 * Delete a group, only if empty.
 * @name DeleteGroup
 * @since 0.1.0
 * @version 1
 * @param {string} groupID Group ID of the group to be deleted.
 * @param {deleteGroupCallback} callback Callback function after deleting a group.
 */

/**
 * Callback after deleting a group.
 * @callback deleteGroupCallback
 * @param {Error} err Error object, should be undefined or passed trough.
 * @param {object} group The deleted group.
 */
exports.deleteGroup = function (groupID, callback) {
    if (!groupID.match(/^[0-9a-fA-F]{24}$/)) {
        var error = new Error('Invalid group ID!');
        error.name = 'EINVALID';
        return callback(error);
    }
    userFunc.findByGroup(groupID, function(err, users) {
        if(err) {
            return callback(err);
        }
        if(users) {
            var error = new Error('Group has user assigned!');
            error.name = 'EOCCUPIED';
            return callback(error);
        }
        Group.findByIdAndRemove(groupID, function (err, group) {
            if(err) {
                return callback(err);
            }
            return callback(null, group);
        })
    });
}
