var Token = require('../models/token.js');
var Client = require('../models/client.js')
var userFunc = require('./user.js');

/**
 * Verify a bearer token.
 * @name verifyToken
 * @since 0.1.0
 * @version 1
 * @param {string} token Bearer token to verify.
 * @param {verifyTokenCallback} callback Callback function after verifying the bearer token.
 */

/**
 * Callback for verifying a bearer token.
 * @callback verifyTokenCallback
 * @param {Error} err Error object, should be undefined.
 * @param {boolean} isMatch Gives if the token is valid.
 * @param {Object} user User object of the user to who the token belongs (if it matches).
 */
exports.verify = function (token, callback) {
    Token.findOne({ value: token }, function (err, respToken) {
        if(err) {
            return callback(err);
        }
        if(!respToken) {
            return callback(null, false);
        }
        userFunc.find(respToken.userId, function (err, user) {
            if(err) {
                return callback(err);
            }
            if(!user) {
                return callback(null, false);
            }
            return callback(null, true, user);
        });
    });
}

/**
 * Get the client corresponding with the token
 * @name getClient
 * @since 0.1.0
 * @version 1
 * @param {string} token Bearer token to get the client from.
 * @param {getClientCallback} callback Callback function after getting the client.
 */

/**
 * Callback for getting the client.
 * @callback getClientCallback
 * @param {Error} err Error object, should be undefined.
 * @param {object} client The client found.
 */
exports.getClient = function (token, callback) {
    Token.findOne({ value: token }, function (err, respToken) {
        if(err) {
            return callback(err);
        }
        if(!respToken) {
            return callback(null, false);
        }
        Client.findById(respToken.clientId, function (err, client) {
            if(err) {
                return callback(err);
            }
            return callback(null, client);
        })
    })
}
