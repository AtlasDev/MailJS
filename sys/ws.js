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

var sub = redis.createClient(config.redis.port, config.redis.host);
var pub = require('./redis.js');
var EventEmitter = require('events');
var server;
var exported = function () {};

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

exported.start = function (server) {
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
                    }));
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
                    }));
                    ws.close();
                    return;
                }
                if(msg.eventName == "login") {
                    if(!msg.data || !msg.data.token) {
                        ws.send(JSON.stringify({
                            type: 'error',
                            error: {
                                name: 'EINVALID',
                                message: 'Missing data.'
                            }
                        }));
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
                                }));
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
                                    }));
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
                                    }));
                                    ws.close();
                                    return;
                                }
                                ws.send(JSON.stringify({
                                    type: 'event',
                                    eventName: 'authSuccess',
                                    data: {
                                        user: user
                                    }
                                }));
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
                        }));
                        ws.close();
                        return;
                    } else {
                        ws.send(JSON.stringify({
                            type: 'error',
                            error: {
                                name: 'EAUTH',
                                message: 'Unknown auth type.'
                            }
                        }));
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
                    }));
                    ws.close();
                }
            } else {
                ws.send(JSON.stringify({
                    type: 'error',
                    error: {
                        name: 'EINVALID',
                        message: 'Not accepting binary.'
                    }
                }));
                ws.close();
                return;
            }
        });
        ws.send(JSON.stringify({
            type: 'event',
            eventName: 'responsive'
        }));
    });
};

var handleClient = function handleClient(ws, user) {
    // TODO: join channels
    // for (var i = 0; i < user.mailboxes.length; i++) {
    //     socket.join('m:'+user.mailboxes[i]);
    // }
    // socket.join('u:'+user._id);
};

module.exports = exported;
}());
