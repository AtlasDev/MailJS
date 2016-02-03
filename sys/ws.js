(function () {
'use strict';

/**
 * @file Centerialized websocket server.
 * @author AtlasDev
 * @copyright Dany Sluijk 2015
 */

// Redis events prefixes, followed by the mongoID:
//  - M: mailbox events
//  - U: user events
//  - S: system events

// Normal message format:
//     - {String} type: 'event'
//     - {String} eventName: Name of the event as defined.
//     - {Object} (optional) data: Data assosiated with the event.

// Error message:
//     - {String} type: 'error'
//     - {object} error: error object.
//         - name: name of the error.
//         - message: explanation of the error.

var redis = require('redis');
var Ws = require('ws').Server;
var emitter = require('events').EventEmitter;
var util  = require('./util.js');
var config = require('../config.json');
var sys = require('./main.js');
var validator = require('validator');

var sub = redis.createClient(config.redis.port, config.redis.host);
var pub = require('./redis.js');
var EventEmitter = require('events');
var server;
var exported = function () {};

var users = {};
var mailboxes = {};

require('util').inherits(exported, emitter);

exported();

sub.on("error", function (err) {
    util.error("Redis subsciber errored", err, true);
});

pub.on("error", function (err) {
    util.error("Redis publisher errored", err, true);
});

sub.on("ready", function () {
    util.log("Subsciber connected to the redis server on port "+config.redis.port, true);
});

pub.on("ready", function () {
    util.log("Publisher connected to the redis server on port "+config.redis.port, true);
});

exported.prototype.start = function (server) {
    server = new Ws({ server: server, clientTracking: false });
    server.on('connection', function connection(ws) {
        ws.on('message', function incoming(msg, flags) {
            if (!flags.binary) {
                try {
                    msg = JSON.parse(msg);
                } catch (e) {
                    ws.send(JSON.stringify({
                        type: 'error',
                        error: {
                            name: 'EINVALID',
                            message: 'Invalid JSON received.'
                        }
                    }), handleError);
                    ws.close();
                    return;
                }
                if(!msg.eventName) {
                    ws.send(JSON.stringify({
                        type: 'error',
                        error: {
                            name: 'EINVALID',
                            message: 'No eventName received.'
                        }
                    }), handleError);
                    ws.close();
                    return;
                }
                if(msg.eventName == "auth") {
                    if(!msg.data || !msg.data.token) {
                        ws.send(JSON.stringify({
                            type: 'error',
                            error: {
                                name: 'EINVALID',
                                message: 'Missing data.'
                            }
                        }), handleError);
                        return;
                    }
                    msg.data.type = msg.data.type || 'session';
                    if(msg.data.type == 'session') {
                        sys.sessions.getSession(msg.data.token, function (err, session) {
                            if(err) {
                                ws.send(JSON.stringify({
                                    type: 'error',
                                    error: {
                                        name: 'EAUTH',
                                        message: 'Authentication failed.'
                                    }
                                }), handleError);
                                ws.close();
                                return;
                            }
                            sys.user.find(session.id, function (err, user) {
                                if(err) {
                                    ws.send(JSON.stringify({
                                        type: 'error',
                                        error: {
                                            name: 'EAUTH',
                                            message: 'Authentication failed.'
                                        }
                                    }), handleError);
                                    ws.close();
                                    return;
                                }
                                if(!user) {
                                    ws.send(JSON.stringify({
                                        type: 'error',
                                        error: {
                                            name: 'EAUTH',
                                            message: 'Authentication failed.'
                                        }
                                    }), handleError);
                                    ws.close();
                                    return;
                                }
                                handleClient(ws, user);
                            });
                        });
                    } else if(msg.data.type == 'oauth') {
                        ws.send(JSON.stringify({
                            type: 'error',
                            error: {
                                name: 'ENOTIMPLEMENTED',
                                message: 'oAuth authentication has not been implemented yet.'
                            }
                        }), handleError);
                        ws.close();
                        return;
                    } else {
                        ws.send(JSON.stringify({
                            type: 'error',
                            error: {
                                name: 'EAUTH',
                                message: 'Unknown auth type.'
                            }
                        }), handleError);
                        ws.close();
                        return;
                    }
                } else {
                    ws.send(JSON.stringify({
                        type: 'error',
                        error: {
                            name: 'ENOAUTH',
                            message: 'Not accepting events before authentication.'
                        }
                    }), handleError);
                    ws.close();
                }
            } else {
                ws.send(JSON.stringify({
                    type: 'error',
                    error: {
                        name: 'EINVALID',
                        message: 'Not accepting binary.'
                    }
                }), handleError);
                ws.close();
                return;
            }
        });
        ws.send(JSON.stringify({
            type: 'event',
            eventName: 'S:responsive'
        }), handleError);
    });
};

var handleClient = function handleClient(ws, user) {
    addUser(user, function (err) {
        if(err) {
            ws.send(JSON.stringify({
                type: 'error',
                error: {
                    name: err.name,
                    message: err.message
                }
            }), handleError);
            ws.close();
            return;
        }
        ws.send(JSON.stringify({
            type: 'event',
            eventName: 'S:authSuccess',
            data: {
                user: user
            }
        }), handleError);
    });
};

var addToMailbox = function addToMailbox(user, mailboxID, cb) {
    var error;
    if (!validator.isMongoId(mailboxID)) {
        error = new Error('Invalid mailbox ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    if(user.mailboxes.indexOf(mailbox) == -1) {
        error = new Error('User not user of the mailbox!');
        error.name = 'EINVALID';
        error.type = 400;
        return cb(error);
    }
    if(mailboxes[mailboxID]) {
        mailboxes[mailboxID].users.push(user._id);
        return cb();
    } else {
        sys.mailbox.find(mailboxID, function (err, mailbox) {
            if(err) {
                return cb(err);
            }
            mailboxes[mailbox._id] = mailbox;
            mailboxes[mailbox].users = [user._id];
            return cb();
        });
    }
};

var addUser = function addUser(user, ws, cb) {
    var error;
    if(users[user._id]) {
        users[user._id].ws.push(ws);
    } else {
        users[user._id] = user;
        users[user._id].ws = [ws];

        var resting = user.mailboxes.length;
        for (var i = 0; i < user.mailboxes.length; i++) {
            addToMailbox(user, user.mailboxes[i], function (err) {
                if(err) {
                    return cb(err);
                }
                resting -= 1;
                if(resting === 0) {
                    return cb()
                }
            });
        }
    }
};

var handleError = function handleError(err) {
    util.error('Websocket errored!', err);
};

exported.prototype.send = function send(type, cb) {

};

module.exports = exported;
}());
