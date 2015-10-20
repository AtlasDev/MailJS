var Group = require('../models/group.js');
var userFunc = require('./user.js');
var validator = require('validator');

/**
 * Compare a permission node to a group
 * @name hasPerm
 * @since 0.1.0
 * @version 1
 * @param {string} node Permission node to compare with.
 * @param {string} group Group ID of the group to compare with.
 * @param {Object} authInfo (optional) Auth info of the request, it also looks for oauth scopes and compares those
 * @param {hasPermCallback} callback Callback function after checking the permission.
 */

/**
 * Callback for creating a new user.
 * @callback hasPermCallback
 * @param {Error} err Error object, should be undefined or passed trough.
 * @param {Boolean} hasPerm Boolean that says if the given has the permission.
 */
exports.hasPerm = function (node, group, authInfo, callback) {
    if(!validator.isMongoId(group)) {
        var error = new Error('Invalid group ID.');
        error.name = 'EVALIDATION';
        error.type = 400;
        return callback(error);
    }
    if(!callback) {
        callback = authInfo;
        authInfo = null;
    }
    if(authInfo && authInfo.type == 'token') {
        if(authInfo.scope.indexOf() == -1) {
            return callback(null, false);
        }
    }
    Group.findById(group, function (err, returnGroup) {
        if(err) {
            return callback(err);
        }
        if(!returnGroup) {
            var error = new Error('Group not found.');
            error.name = 'ENOTFOUND';
            error.type = 404;
            return callback(error);
        }
        if(returnGroup.permissions.indexOf(node) > -1) {
            return callback(null, true);
        } else {
            return callback(null, false);
        }
    })
}
