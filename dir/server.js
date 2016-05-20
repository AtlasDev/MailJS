/**
 * @file The main class for MailJS
 * @author AtlasDev
 * @copyright Dany Sluijk 2015
 */

/* Copyright (C) AtlasDev - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Dany Sluijk <dany@atlasdev.nl>, January 2015
 */

'use strict'
var cluster = require('cluster');
var config  = require('config');
var logger  = require('../lib/log.js');
var pack    = require('../package.json');
var os      = require('os');

if(cluster.isMaster){
	process.title = config.has('processName') ? config.get('processName') : 'MailJS';

	logger.info('Starting MailJS', {
		platform: process.platform,
		arch: process.arch,
		mailjs: pack.version,
		nodejs: process.version,
		engine: process.versions.v8
	});

	logger.info('Booting workers');
	for(var i = 0; i < os.cpus().length; i++) {
	    cluster.fork();
	}

	cluster.on('exit', function(worker, code, signal) {
	    logger.error('Worker '+worker.process.pid+' died ('+(code||signal)+'), restarting...');
		if(config.has('debug') && config.get('debug') == true) {
			process.exit(1);
		}
	    cluster.fork();
	});

	process.on('uncaughtException', function(err) {
	    logger.error("An uncaught exception has taken place!", err);
	});
} else {
	logger.info('Booting worker #'+cluster.worker.id);
	process.title = (config.has('processName') ? config.get('processName') : 'MailJS') + ' worker #'+cluster.worker.id;

	require('../lib/mongo.js').then(function() {
		return require('../lib/http/http.js');
	}).then(function() {
		require('../lib/redis.js');
		//TODO
		//require('../lib/smtp/smtp.js');
	}).catch(function (err) {
		logger.error('Could not start server.', err);
		process.exit(1);
	});

	process.on('uncaughtException', function(err) {
	    logger.error("An uncaught exception has taken place!", err);
	});
}
