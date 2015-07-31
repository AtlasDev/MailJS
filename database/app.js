'use strict';

var mongoose = require('mongoose');
var UserSchema = require('./models/user.js');
var UserFunctions = require('./user.js');

var db = function db(core) {
    mongoose.connect('mongodb://'+core.config.db.host+':'+core.config.db.port+'/'+core.config.db.database);
}

db.prototype.UserSchema = function() {
    return UserSchema;
}

db.prototype.user = function() {
    console.log('s')
}

module.exports = db;