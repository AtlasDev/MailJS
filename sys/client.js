var util = require('../util.js');
var Client = require('../models/client.js');
var Code = require('../models/code.js');
var Token = require('../models/token.js');

/**
 * Create a new client.
 * @name createClient
 * @since 0.1.0
 * @version 1
 * @param {obj} user User object.
 * @param {string} name Client name to identify the client with.
 * @param {string} description Client description
 * @param {array} scopes Scopes used in the client.
 * @param {createClientCallback} callback Callback function after creating the client.
 */

/**
 * Callback for creating a new client.
 * @callback createClientCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} client Client object of the new created client, id and secret are not hashed here, these values should be send back to the origin of the request.
 */
exports.create = function (user, name, description, scopes, callback) {
    var client = new Client();
    var id = util.uid(10);
    var secret = util.uid(10);
    client.name = name;
    client.description = description;
    client.scopes = scopes;
    client.id = id;
    client.secret = secret;
    client.userId = user._id;
    client.save(function(err) {
        if (err) {
            return callback(err, null);
        }
        var responseClient = client;
        responseClient.id = id;
        responseClient.secret = secret;
        util.log('Client `'+client.name+'` created');
        return callback(null, responseClient);
    });
}

/**
 * Get all clients.
 * @name getClient
 * @since 0.1.0
 * @version 1
 * @param {string|null} userID Userid of the user to find the sessions from, it finds all clients when null.
 * @param {int} limitBy Amount of clients to limit to. Default: 20
 * @param {int} skip Amount of clients to skip before returning, can be used for pagination. Default: 0;
 * @param {getClientCallback} callback Callback function after finding all client.
 */

/**
 * Callback for gettting all clients of a user.
 * @callback getClientCallback
 * @param {Error} err Error object, should be undefined.
 * @param {array} clients Found clients in a array.
 */
exports.get = function function_name(userID, limitBy, skip, callback) {
    limitBy = limitBy || 20;
    skip = skip || 0;
    var query = (userID) ? {userId: userID} : {};
    Client.find(query)
    .limit(limitBy)
    .skip(skip)
    .sort({name: 'asc'})
    .exec(function(err, clients) {
        if (err) {
            return callback(err, null);
        }
        return callback(null, clients);
    });
}

/**
 * Verify the id and secret of a client.
 * @name verifyClient
 * @since 0.1.0
 * @version 1
 * @param {string} username The id of the client.
 * @param {string} password the secret of the client.
 * @param {verifyClientCallback} callback Callback function after verifying the client.
 */

/**
 * Callback for verifying a user.
 * @callback verifyClientCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Boolean} match If the id and the secret match the ones in the database.
 * @param {object} client The client found in the database.
 */
exports.verify = function (username, password, callback) {
    Client.findOne({id: username}, function (err, client) {
        if(err) {
            return callback(err);
        }
        if(!client) {
            return callback(null, false, false);
        }
        client.verifySecret(password, function (err, match) {
            if(err) {
                return callback(err);
            }
            return callback(null, match, client);
        })
    });
}

/**
 * Remove a specific client, also removes all access tokens and codes.
 * @name deleteClient
 * @since 0.1.0
 * @version 1
 * @param {string} clientID ID of the client to be deleted.
 * @param {deleteClientCallback} callback Callback function after deleting a client.
 */

/**
 * Callback for deleting a clients.
 * @callback deleteClientCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Int} removedTokens Amount of deleted tokens in the process.
 * @param {Int} removedCodes Amount of deleted codes in the process.
 */
exports.delete = function (clientID, callback) {
    Token.find({clientId: clientID}).remove(function (err, removedTokens) {
        if(err) {
            return callback(err);
        }
        Code.find({clientId: clientID}).remove(function (err, removedCodes) {
            if(err) {
                return callback(err);
            }
            Client.findByIdAndRemove(clientID, function(err, client) {
                if(err) {
                    return callback(err);
                }
                if(client == null) {
                    var error = new Error('The given id was not found.');
                    error.name = 'ENOTFOUND';
                    return callback(error);
                } else {
                    util.log('Client `'+client._id+'` deleted.');
                    return callback(null, removedTokens, removedCodes);
                }
            });
        });
    });
}

/**
 * Remove all clients of a user, also removes all access tokens and codes.
 * @name deleteUserClient
 * @since 0.1.0
 * @version 1
 * @param {string} userID ID of the user from which the clients should be deleted.
 * @param {deleteUserClientCallback} callback Callback function after deleting all clients.
 */

/**
 * Callback for gettting all clients of a user.
 * @callback deleteClientCallback
 * @param {Error} err Error object, should be undefined.
 */
exports.deleteUser = function (userID, callback) {
    Client.find({userId: userID}, function (err, clients) {
        if(err) {
            callback(err);
        }
        exports.delete()
        callback();
        deleteUserHelper(0, clients, function (err) {
            if(err) {
                return callback(err);
            }
            return callback(null);
        })
    })
}

var deleteUserHelper = function (i, clients, cb) {
    if( i < length ) {
        exports.delete(clients[i]._id, function(err) {
            if(err) {
                cb(err);
            }
            deleteUserHelper(i+1);
        })
    } else {
        cb();
    }
}
