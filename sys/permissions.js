var redis = require('../redis.js');

/**
 * Compare a permission node to a group
 * @name hasPerm
 * @since 0.1.0
 * @version 1
 * @param {string} node Permission node to compare with.
 * @param {int} group Group number to compare with.
 * @param {hasPermCallback} callback Callback function after checking the permission.
 */

/**
 * Callback for creating a new user.
 * @callback hasPermCallback
 * @param {Error} err Error object, should be undefined or passed trough.
 * @param {Boolean} hasPerm Boolean that says if the given has the permission.
 */

exports.hasPerm = function (node, group, callback) {
    redis.hget("perms", node, function (err, reply) {
        if(err) {
            return callback(err, null);
        }
        if(group <= reply.toString()) {
            return callback(null, true);
        }  else {
            return callback(null, false);
        }
    });
}
