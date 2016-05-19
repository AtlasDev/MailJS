(function () {
'use strict';

const winston = require('winston');
var config = require('config');
var cluster = require('cluster');
var fs = require('fs');
var suffix = cluster.isMaster ? '' : '.worker'+cluster.worker.id;

fs.mkdir('../log', function(err) {
	if(err && err.code !== 'EEXIST') {
		console.error('Failed to create logging folder!');
	}
});

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.File)({
			name: 'errorLog',
			filename: '../log/error'+suffix+'.log',
			level: 'error'
		}),
		new (winston.transports.Console)()
	]
});

if(config.has('debug') && config.get('debug') === true) {
	logger.add(winston.transports.File, {
		name: 'infoLog',
		filename: '../log/info'+suffix+'.log',
		level: 'info'
	});
}

module.exports = logger;
}());
