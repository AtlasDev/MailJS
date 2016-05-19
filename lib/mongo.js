module.exports = function () {
'use strict';

return new Promise(function(resolve, reject) {
	var mongoose = require('mongoose');
	var logger = require('./log.js');
	var error = require('./error.js');
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
	        reject(error.database('Could not connect to the database'));
	    }
	});

	mongoose.connection.on('connected', function () {
	    logger.log('info', 'Connected to MongoDB on port '+config.get('db.mongod.port'));
		resolve(db);
	});

	mongoose.connection.on('reconnected', function () {
	    logger.info('Reconnected to database after connection has been lost.');
	});

	mongoose.connection.on('disconnected', function () {
	    logger.info('Disconnected from the database.');
	});
});
}();
