module.exports = function () {
'use strict';

var config = require('config');
var pack = require('../package.json');
var redis = require('redis');
var logger = require('../lib/log.js');
var mongoose = require('mongoose');

logger.info('Uninstalling MailJS', {
	platform: process.platform,
	arch: process.arch,
	mailjs: pack.version,
	nodejs: process.version,
	engine: process.versions.v8
});

if(config.has('uninstall') && config.get('uninstall') === false) {
    logger.info('Uninstallation disabled in the config.');
    process.exit(0);
}

var mongo = require('../lib/mongo.js');

mongo.then(function (db) {
	return new Promise(function(resolve, reject) {
	    mongoose.connection.db.dropDatabase(function (err) {
			if(err) {
				reject(err);
			} else {
				logger.info('Dropped database.');
				resolve();
			}
		});
	});
}).then(function () {
	return new Promise(function (resolve, reject) {
		resolve(require('../lib/redis.js'));
	});
}).then(function (redis) {
	return new Promise(function(resolve, reject) {
		redis.on('ready', function () {
            redis.flushdb(function (err) {
				if(err) {
					return reject(err);
				}
                logger.info('Redis flushed.');
                logger.info('Uninstall successfull, it is a shame to see you go away :(');
				require('mongoose').disconnect();
				process.exit(0);
				resolve();
            });
        });
	});
}).catch(function (err) {
	logger.error('Could not uninstall!', err);
	process.exit(1);
});
};
