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
    Group.findById(groupID, function (err, group) {
        if(err) {
            return callback(err);
        }
        return callback(null, group);
    })
}
