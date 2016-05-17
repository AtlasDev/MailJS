(function () {
'use strict';

var mongoose = require('mongoose');
var logger = require('./log.js');
var config = require('config');
var DBinit = false;

if(!config.has('db.mongod.host') || !config.has('db.mongod.port') || !config.has('db.mongod.database') || !config.has('db.mongod.username')
 || !config.has('db.mongod.password')) {
	logger.error('Missing MongoDB config variables');
	process.exit(1);
}

var db = mongoose.connect('mongodb://'+config.get('db.mongod.host')+':'+config.get('db.mongod.port')+'/'+config.get('db.mongod.database'), {
	user: config.get('db.mongod.username'),
	pass: config.get('db.mongod.password')
});

mongoose.connection.on('error', function(err) {
    if(DBinit !== false) {
        logger.error('Database errored!', err);
    } else {
        logger.error('Could not connect to the database! Is it reachable?');
    }
});

mongoose.connection.on('connected', function () {
    logger.log('info', 'Connected to MongoDB on port '+config.db.port, true);
});

mongoose.connection.on('reconnected', function () {
    logger.log('info', 'Reconnected to database after connection has been lost', true);
});

mongoose.connection.on('disconnected', function () {
    logger.log('error', 'Disconnected from the database!');
});

module.exports = db;
}());
