(function () {
'use strict';

var Group = require('../models/group.js');
var validator = require('validator');

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
    });
};

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
    if (!validator.isMongoId(groupID)) {
        var error = new Error('Invalid group ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    Group.findById(groupID, function (err, group) {
        if(err) {
            return callback(err);
        }
        return callback(null, group);
    });
};

/**
 * Get the default group.
 * @name getDefaultGroup
 * @since 0.1.0
 * @version 1
 * @param {getDefaultGroupCallback} callback Callback function after getting the default group.
 */

/**
 * Callback for getting the default group.
 * @callback getDefaultGroupCallback
 * @param {Error} err Error object, should be undefined.
 * @param {object} group The requested group.
 */
exports.getDefaultGroup = function (callback) {
    Group.findOne({default: true}, function (err, group) {
        if(err) {
            return callback(err);
        }
        return callback(null, group);
    });
};

/**
 * Create a new group
 * @name createGroup
 * @since 0.1.0
 * @version 1
 * @param {string} name A indentification name, like `Admin`, `Mod` or `User`. (these examples are autocreated!)
 * @param {string|null} type The name of the group of groups the new group belongs. No opperating reason, just for sorting. Copies from masterGroup if null, throws error if masterGroup is also null.
 * @param {string|array} masterGroup Group ID it should copy the propperties from. Creates a group with the permissions array if it is an array.
 * @param {boolean} def Set group defaut
 * @param {createGroupCallback} callback Callback function after creating the group.
 */

/**
 * Callback for getting all groups.
 * @callback getGroupsCallback
 * @param {Error} err Error object, should be undefined or passed trough.
 * @param {object} group The new created group.
 */

//TODO rewrite?
exports.createGroup = function (name, type, masterGroup, def, callback) {
    var error;
    if(!name) {
        error = new Error('Name not set');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    if(!masterGroup && !type) {
        error = new Error('Type AND masterGroup not set.');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    if(typeof masterGroup == "string") {
        if (!validator.isMongoId(masterGroup)) {
            error = new Error('Invalid masterGroup ID!');
            error.name = 'EVALIDATION';
            error.type = 400;
            return callback(error);
        }
        Group.findById(masterGroup, function (err, responseMasterGroup) {
            var error;
            if(err) {
                return callback(err);
            }
            if(!responseMasterGroup) {
                error = new Error('Master group not found');
                error.name = 'ENOTFOUND';
                error.type = 404;
                return callback(error);
            }
            type = type || responseMasterGroup.type;
            groupCreateHelper(name, type, responseMasterGroup.permissions, def, function (err, group) {
                if(err) {
                    return callback(err);
                }
                return callback(null, group);
            });
        });
    } else {
        groupCreateHelper(name, type, masterGroup, def, function (err, group) {
            if(err) {
                return callback(err);
            }
            return callback(null, group);
        });
    }
};

var groupCreateHelper = function (name, type, perms, def, callback) {
    var group = new Group();
    group.name = name;
    group.type = type;
    group.default = def;
    group.permissions = perms;
    group.save(function (err) {
        if(err) {
            return callback(err);
        }
        return callback(null, group);
    });
};

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
    if (!validator.isMongoId(groupID)) {
        var error = new Error('Invalid group ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    userFunc.findByGroup(groupID, function(err, users) {
        if(err) {
            return callback(err);
        }
        if(users) {
            var error = new Error('Group has users assigned!');
            error.name = 'EOCCUPIED';
            error.type = 400;
            return callback(error);
        }
        Group.findByIdAndRemove(groupID, function (err, group) {
            if(err) {
                return callback(err);
            }
            return callback(null, group);
        });
    });
};
}());
