(function () {
'use strict';

//Exports all system functions in one file. You can require this file to access all functions.
exports.client = require('./client.js');
exports.user = require('./user.js');
exports.perms = require('./permissions.js');
exports.mailbox = require('./mailbox.js');
exports.domain = require('./domain.js');
exports.inbox = require('./inbox.js');
exports.token = require('./token.js');
exports.sessions = require('./sessions.js');
exports.email = require('./email.js');

exports.redis = require('./redis.js');
exports.util = require('./util.js');
exports.worker = require('./worker.js');
}());
