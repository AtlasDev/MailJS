module.exports = function () {
'use strict';

var config = require('config');
var pack = require('../package.json');
var logger = require('../lib/log.js');
var validate = require('../lib/validate.js');
var error = require('../lib/error.js');
var user = require('../lib/user.js');
var group = require('../lib/group.js');
var domain = require('../lib/domain.js');
var prompt = require('prompt');
var promptResults;

logger.info('Installing MailJS', {
	platform: process.platform,
	arch: process.arch,
	mailjs: pack.version,
	nodejs: process.version,
	engine: process.versions.v8
});

var mongo = require('../lib/mongo.js');

mongo.then(function () {
	return new Promise(function(resolve, reject) {
		user.getAll(null, null, 'username').then(function (users) {
			if(users.length > 0) {
				return reject(error.invalid('MailJS already installed!'));
			}
			resolve();
		})
	});
}).then(function() {
	return require('../lib/http/http.js');
}).then(function(db) {
	return new Promise(function(resolve, reject) {
		prompt.get(['username', 'password', 'repeat password', 'initial domain', 'admin group name'], function (err, result) {
			if(err) {
				reject(err);
			} else if(!validate.name(result.username)) {
				reject(error.validation('Invalid username.'));
			} else if(!validate.password(result.password)) {
				reject(error.validation('Invalid password.'));
			} else if(result['password'] !== result['repeat password']) {
				reject(error.validation('Passwords do not match.'));
			} else if(!validate.domain(result['initial domain'])) {
				reject(error.validation('Invalid domain.'));
			} else if(!validate.name(result['admin group name'])) {
				reject(error.validation('Invalid group name.'));
			} else {
				promptResults = result;
				resolve();
			}
		});
	});
}).then(function() {
	logger.info('Creating first group..');
	return group.create(promptResults['admin group name'], '#F00');
}).then(function (group) {
	logger.info('Creating first user..');
	return user.create(promptResults['username'], promptResults['password'], group._id);
}).then(function (user) {
	logger.info('Creating initial domain.');
	return domain.create(promptResults['initial domain'], user._id);
}).then(function () {
	return new Promise(function(resolve, reject) {
		require('mongoose').disconnect();
		logger.info('All set! Use `mailjs start` to start the daemon, and browse to the web app to set up the initial domain.');
		resolve();
		process.exit(0);
	});
}).catch(function (err) {
	logger.error('Could not install!', err);
	process.exit(1);
});
};
